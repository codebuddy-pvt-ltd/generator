import { TCommandArgs } from '.';
import path from 'path';
import fs, { promises as fsPrms } from 'fs';
import logger from '../utils/logger';
import { validate } from '../utils/validate';
import * as Joi from 'joi';
import configs from '../utils/config';
import { v4 as uuidv4 } from 'uuid';
import { archive } from '../utils/archive';
import http from '../utils/api';
import FormData from 'form-data';

export interface IContributeManifest {
  name: string;
  manifestVersion: string;
  frameworkName: string;
  frameworkVersions: string;
  version: string;
}

const validManifestVersions = ['v1'];

export const contributeCommand: TCommandArgs = [
  'contribute',
  'Contribute something to the repository',
  () => {
    //
  },
  async () => {
    const cwd = process.cwd();

    const manifest = await loadManifest();

    await validateManifest(manifest);

    // create archive
    const manifestTarballName = `_tarball.${uuidv4()}.zip`;
    const archivePath = path.resolve(cwd, manifestTarballName);
    fs.createWriteStream(archivePath);
    try {
      await archive(process.cwd(), archivePath);
    } catch (error) {
      logger.error(error.message);
      process.exit(1);
    }

    // upload archive
    let uploadId: string | null;
    const form = new FormData();
    const stats = fs.statSync(archivePath);
    const fileSizeInBytes = stats.size;
    const fileStream = fs.createReadStream(archivePath);
    form.append('files', fileStream, { knownLength: fileSizeInBytes });

    await http
      .post('/files/upload', form, {
        hasFiles: true,
      })
      .then((res: any) => {
        uploadId = res.data.files[0].id;
      })
      .catch((err) => {
        logger.error(err);
        process.exit(1);
      });

    // submit contribution
    await http
      .post('/api/projects/contribute', { ...manifest, uploadId })
      .then(() => {
        logger.success(
          `Congratulations!!! ${manifest.name}@${manifest.version} has been successfully published!`,
        );
      })
      .catch((err) => {
        logger.error(err.message);
      });

    // cleanup: delete archive when everything is done
    try {
      await fsPrms.unlink(archivePath);
    } catch (error) {
      //
    }
  },
];

export const loadManifest = async (): Promise<IContributeManifest> => {
  const cwd = process.cwd();

  const manifestPath = path.resolve(cwd, 'manifest.json');
  const readmePath = path.resolve(cwd, 'readme.md');

  // validate manifest.json exists
  let manifestContent: null | string = null;
  try {
    manifestContent = await fsPrms.readFile(manifestPath, 'utf-8');
  } catch (error) {
    logger.error(`${manifestPath} is missing`);
    process.exit(1);
  }

  // validate readme.md exists
  try {
    await fsPrms.readFile(readmePath, 'utf-8');
  } catch (error) {
    logger.error(`${readmePath} is missing`);
    process.exit(1);
  }

  // validate valid json
  let manifest: IContributeManifest | null = null;
  try {
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    logger.error(`${manifestPath} is invalid`);
    process.exit(1);
  }

  return manifest;
};

export const validateManifest = async (manifest: IContributeManifest) => {
  validateManifestData(manifest);
  await validateSrc();
};

const getManifestVersion = (manifest: IContributeManifest) => {
  const manifestVersionValidationResult = validate(
    manifest,
    Joi.object().keys({
      manifestVersion: Joi.string()
        .valid(...validManifestVersions)
        .required(),
    }),
    {
      allowUnknown: true,
    },
  );

  if (manifestVersionValidationResult.error?.message) {
    logger.error(`Invalid manifest.json, ${manifestVersionValidationResult.error.message}`);
    process.exit(1);
  }

  return manifest.manifestVersion;
};

const validateManifestData = (manifest: IContributeManifest) => {
  const manifestVersion = getManifestVersion(manifest);

  let schema: Joi.Schema;

  if (manifestVersion === 'v1') {
    schema = Joi.object().keys({
      name: Joi.string().min(3).required(),
      description: Joi.string().min(100).required(),
      manifestVersion: Joi.string().required(),
      frameworkName: Joi.string()
        .valid(...configs.map((frameworkConfig) => frameworkConfig.framework))
        .required(),
      frameworkVersions: Joi.array().items(Joi.string().required()).min(1).required().required(),
      version: Joi.string().required(),
    });
  }

  const manifestVersionValidationResult = validate(manifest, schema);

  if (manifestVersionValidationResult.error?.message) {
    logger.error(`manifest error -> ${manifestVersionValidationResult.error.message}`);
    process.exit(1);
  }
};

export const validateSrc = async () => {
  const cwd = process.cwd();

  const srcFolderPath = path.resolve(cwd, 'src');

  // validate src folder exists
  try {
    const res = await fsPrms.readdir(srcFolderPath);

    // validate src folder is not empty
    if (!res.length) {
      logger.error(`${srcFolderPath} directory is empty`);
      process.exit(1);
    }
  } catch (error) {
    logger.error(`${srcFolderPath} directory is missing`);
    process.exit(1);
  }
};
