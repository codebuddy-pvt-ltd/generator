import yargs, { conflicts } from 'yargs';
import { TCommandArgs } from '.';
import http from '../utils/api';
import logger from '../utils/logger';
import os from 'os';
import fsPrms from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { download } from '../utils/download';
import AdmZip from 'adm-zip';
import { getFilesList } from '../utils/getFilesList';
import inquirer from 'inquirer';
import { createOrWriteFile } from '../utils/createFileIfNotExists';

export const injectCommand: TCommandArgs = [
  'inject [name]',
  'Inject a project/service/code',
  (yargs: yargs.Argv) => {
    yargs.demandOption(['name']);

    yargs.positional('name', {
      describe: 'project name from cbd registry, eg. nest-auth',
      type: 'string',
    });
  },
  async (argv) => {
    const projectName = argv.name;

    await http
      .get(`/api/projects/${projectName}`)
      .then(async (res: any) => {
        const downloadUrl = res.data.project.latestVersion.upload.absoluteLink;
        const downloadFileName = res.data.project.latestVersion.upload.name;
        const downloadDir = path.resolve(os.homedir(), '.cbd-cli-cache');
        // create download folder if does not exists already
        try {
          await fsPrms.readdir(downloadDir);
        } catch (error) {
          await fsPrms.mkdir(downloadDir);
        }

        const zipFilePath = path.resolve(os.homedir(), '.cbd-cli-cache', downloadFileName);
        await download(downloadUrl, zipFilePath);

        // proceed injection
        try {
          const zip = new AdmZip(zipFilePath);
          const outputDir = path.resolve(
            os.homedir(),
            '.cbd-cli-cache',
            res.data.project.latestVersionId,
          );
          fsPrms.mkdir(outputDir, { recursive: true });

          zip.extractAllTo(outputDir);

          const outputSrcDir = path.resolve(outputDir, 'src');
          let files = getFilesList(outputSrcDir);

          const overridePromptOptions: {
            source: string;
            destination: string;
          }[] = [];

          files.forEach((filName) => {
            const checkPath = path.resolve(process.cwd(), filName);
            if (fs.existsSync(checkPath)) {
              overridePromptOptions.push({
                source: filName,
                destination: checkPath,
              });
            }
          });

          if (overridePromptOptions.length) {
            logger.warn(
              '!!! Some of the files are conflicting, would you like to override them? You can always go back to the previous state by simply discarding changes in version control.',
            );

            const { overrideType } = await inquirer.prompt([
              {
                type: 'list',
                name: 'overrideType',
                message: 'Select how you want to override the conflicted files?',
                choices: ['Override all', 'Let me choose', 'Do not override'],
              },
            ]);

            if (overrideType === 'Override all') {
              // do not need to do anything
              // simply override all files from files array
            }
            if (overrideType === 'Let me choose') {
              for (const conflict of overridePromptOptions) {
                const { choice } = await inquirer.prompt([
                  {
                    type: 'list',
                    name: 'choice',
                    message: `Override ${conflict.source}`,
                    choices: ['Yes', 'No'],
                  },
                ]);

                if (choice === 'No') {
                  // remove file from files array so that it is not overridden
                  files = files.filter((file) => file !== conflict.source);
                }
              }
            }
            if (overrideType === 'Do not override') {
              files = files.filter(
                (file) =>
                  !overridePromptOptions.map((conflictFile) => conflictFile.source).includes(file),
              );
            }
          }

          if (!files.length) {
            logger.info('Nothing to do! :(');
          } else {
            logger.info('Files to be written/overridden:');
            files.forEach((file) => {
              logger.info(` -> ${file}`);
            });

            const { confirmWrite } = await inquirer.prompt([
              {
                type: 'list',
                name: 'confirmWrite',
                message: 'Confirm write in file system',
                choices: ['Yes', 'No'],
              },
            ]);

            if (confirmWrite === 'Yes') {
              for (const file of files) {
                const destinationPath = path.resolve(process.cwd(), file);
                const sourcePath = path.resolve(outputSrcDir, file);

                const content = await fsPrms.readFile(sourcePath, 'utf-8');

                await createOrWriteFile(destinationPath, content);
              }

              logger.success('All files injected successfully!');
            } else {
              logger.info('Not doing anything! :(');
            }
          }
        } catch (error) {
          logger.error(error.message);
        } finally {
          try {
            await fsPrms.unlink(zipFilePath);
          } catch (error) {
            //
          }

          const outputDir = path.resolve(
            os.homedir(),
            '.cbd-cli-cache',
            res.data.project.latestVersionId,
          );
          try {
            await fsPrms.rm(outputDir, { recursive: true });
          } catch (error) {
            //
          }

          process.exit(1);
        }
      })
      .catch((err) => {
        logger.error(err.message);
        process.exit(1);
      });
  },
];
