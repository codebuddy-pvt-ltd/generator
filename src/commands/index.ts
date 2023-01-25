import yargs from 'yargs';

export * from './scaffoldGen';
export * from './list';
export * from './login';
export * from './inject';

export type TCommandArgs = [
  string,
  string,
  (yargs: yargs.Argv) => void | Promise<void>,
  (
    yargs: yargs.ArgumentsCamelCase<{
      [id: string]: string;
    }>,
  ) => any,
];
