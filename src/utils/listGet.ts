import logger from './logger';
import configs from './config';

export const listGet = () => {
  configs.forEach((config) => {
    logger.info(`[*] ${config.framework}`);
    config.versions.forEach((version) => {
      logger.info(`\t[*] version: ${version.version} > ${version.command}`);
    });
  });
};
