import os from 'os';
import path from 'path';
import fs from 'fs/promises';

export const getToken = async () => {
  const configFile = path.resolve(os.homedir(), '.cbd-cli.json');

  try {
    const content = await fs.readFile(configFile, 'utf-8');
    return JSON.parse(content).token;
  } catch (error) {
    throw new Error('Unauthorized');
  }
};
