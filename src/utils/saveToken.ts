import os from 'os';
import path from 'path';
import fs from 'fs/promises';

export const saveToken = async (token: string) => {
  const configFile = path.resolve(os.homedir(), '.cbd-cli.json');
  await fs.writeFile(configFile, JSON.stringify({ token }), 'utf-8');
};
