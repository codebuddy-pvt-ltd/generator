import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { listGet } from './utils/listGet';
import { scaffold } from './utils/scaffold';
import pJson from '../package.json';

export default async () => {
  yargs(hideBin(process.argv))
    .version(pJson.version)
    .command(
      'scaffold [framework] [frameworkVersion] [name]',
      'Scaffold project',
      (yargs) => {
        yargs.demandOption(['framework', 'frameworkVersion']);

        return yargs
          .positional('framework', {
            describe: 'framework name, eg. nest',
            type: 'string',
          })
          .positional('frameworkVersion', {
            describe: 'major framework version, eg. 9',
            type: 'string',
          })
          .positional('name', {
            describe: 'project folder name, eg. todo-app',
            type: 'string',
          });
      },
      async (argv) => {
        await scaffold(argv.framework, argv.frameworkVersion, argv.name);
      },
    )
    .command(
      'list [option]',
      'List available options',
      (yargs) => {
        yargs.demandOption(['option']);

        return yargs.positional('option', {
          describe: 'available options, eg. scaffolds',
          type: 'string',
          choices: ['scaffolds', 'services'],
        });
      },
      async (argv) => {
        if (argv.option === 'scaffolds') listGet();
      },
    )
    .demandCommand()
    .parse();
};
