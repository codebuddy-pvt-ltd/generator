import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import pJson from '../package.json';
import { scaffoldCommand, listCommand, loginCommand, injectCommand } from './commands';
import { contributeCommand } from './commands/contribute';

export default async () => {
  yargs(hideBin(process.argv))
    .version(pJson.version)
    .command(...scaffoldCommand)
    .command(...listCommand)
    .command(...loginCommand)
    .command(...contributeCommand)
    .command(...injectCommand)
    .demandCommand()
    .parse();
};
