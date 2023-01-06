import logger from './logger';
import configs from './config';

export const listGet = () => {
  const list = [];
  configs.forEach((config) => {
    config.versions.forEach((version) => {
      const row = [config.framework, version.version, version.command];
      list.push(row);
    });
  });

  logger.table(list);
};
