import getGitUrl from './getGitUrl';
import logger from './logger';
import yargs from 'yargs';
import runCommand from './runCommand';
import path from 'path';
import fs from 'fs/promises';

export const scaffold = async (framework: string, version: string, name: string) => {
  const gitUrl = getGitUrl(framework, version);

  if (!gitUrl) {
    logger.error(
      '\nError: Unable to find framework or version. Try listing available frameworks using -l or --list option\n',
    );
    yargs.showHelp();
    return;
  }

  // clone git repo with only last commit
  // if name is provided as option then create folder as name argument or rely on git repo name
  await runCommand(`git clone --depth 1 ${gitUrl} ${name?.length ? name : ''}`, {}, false);

  // decide newly created folder name
  const folderName = name?.length ? name : gitUrl.split('/')[gitUrl.split('/').length - 1];

  const newProjectDir = path.resolve(folderName);
  const newProjectGitDir = path.resolve(newProjectDir, '.git');

  // remove existing .git folder otherwise its not committable since the history does not match
  await fs.rm(newProjectGitDir, {
    recursive: true,
  });

  // re-init git for fresh start
  await runCommand(`git init`, { cwd: newProjectDir }, false);
};
