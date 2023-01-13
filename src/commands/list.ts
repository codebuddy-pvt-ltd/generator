import yargs from 'yargs';
import { TCommandArgs } from '.';
import { listGet } from '../utils/listGet';

export const listCommand: TCommandArgs = [
  'list [option]',
  'List available options',
  (yargs: yargs.Argv) => {
    yargs.demandOption(['option']);

    yargs.positional('option', {
      describe: 'available options, eg. scaffolds',
      type: 'string',
      choices: ['scaffolds', 'services'],
    });
  },
  async (argv) => {
    if (argv.option === 'scaffolds') listGet();
  },
];
