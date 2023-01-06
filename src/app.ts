import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import logger from './utils/logger';
import { scaffold } from './utils/scaffold';
import { listGet } from './utils/listGet';
import pJson from '../package.json';

export interface ICliArgs {
  f: string; // framework
  framework: string;
  v: string; // framework version
  'framework-version': string;
  list: string;
  n: string; // name
  name: string;
}

export default async () => {
  const usage = chalk.keyword('violet')(
    '\nUsage: cbd-gen -f <framework>  -v <framework-version> \n',
  );

  // adds command line helpers
  yargs
    .usage(usage)
    .option('f', {
      alias: 'framework',
      describe: 'Choose framework',
      type: 'string',
      demandOption: false,
    })
    .option('v', {
      alias: 'framework-version',
      describe: 'Choose major framework version',
      type: 'string',
      demandOption: false,
    })
    .option('n', {
      alias: 'name',
      describe: 'Project folder name',
      type: 'string',
      demandOption: false,
    })
    .option('list', {
      describe: 'List available frameworks with versions list',
      type: 'string',
      demandOption: false,
    })
    .version(pJson.version)
    .help(true).argv;

  // parse cli input (ignore sys args)
  const argv = yargs(hideBin(process.argv)).argv as any as ICliArgs;

  // show list of available options then quit the program
  if (argv.list) {
    listGet();
    return;
  }

  // show help if framework option not provided
  if (!argv.f && !argv.framework) {
    logger.error('\nError: Must choose a framework using -f or --framework option\n');
    yargs.showHelp();
    return;
  }

  const framework = argv.f || argv.framework;
  const version = argv.v || argv['framework-version'];
  const name = argv.n || argv.name;

  // do scaffold
  await scaffold(framework, version, name);
};
