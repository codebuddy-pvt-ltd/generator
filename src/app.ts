import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import pJson from '../package.json';
import { scaffoldCommand, listCommand } from './commands';

export default async () => {
  yargs(hideBin(process.argv))
    .version(pJson.version)
    .command(...scaffoldCommand)
    .command(...listCommand)
    .demandCommand()
    .parse();
};
