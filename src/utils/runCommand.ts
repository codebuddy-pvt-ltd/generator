import { exec, ExecOptions } from 'node:child_process';
import logger from './logger';

export default (command = '', options: ExecOptions, output = true) =>
  new Promise((resolve, reject) => {
    try {
      exec(command, options, (error, stdout) => {
        if (error) {
          if (output) logger.error(error);
          reject(error);
        } else if (stdout) {
          if (output) logger.info(stdout);
        }
        resolve(true);
      });
    } catch (error) {
      if (output) logger.error(error);
      reject();
    }
  });
