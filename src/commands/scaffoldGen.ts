import yargs from 'yargs';
import { TCommandArgs } from '.';
import { scaffold } from '../utils/scaffold';

export const scaffoldCommand: TCommandArgs = [
  'scaffold [framework] [frameworkVersion] [name]',
  'Scaffold project',
  (yargs: yargs.Argv) => {
    yargs.demandOption(['framework', 'frameworkVersion']);

    yargs
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
];
