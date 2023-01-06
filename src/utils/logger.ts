/* eslint-disable no-console */
import chalk from 'chalk';
import { table } from 'table';

export default {
  info: (log: any) => {
    console.log(chalk.blue(log));
  },
  success: (log: any) => {
    console.log(chalk.green(log));
  },
  error: (log: any) => {
    console.log(chalk.red(log));
  },
  warn: (log: any) => {
    console.log(chalk.yellow(log));
  },
  table: (log: any) => {
    console.log(chalk.blue(table(log)));
  },
};
