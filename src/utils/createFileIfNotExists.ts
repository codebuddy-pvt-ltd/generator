import fs from 'fs/promises';
import path from 'path';

export const createOrWriteFile = async (destinationPath: string, content: string) => {
  const items = destinationPath.split('/');
  const dir = path.join('/', ...items.slice(0, items.length - 1));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(destinationPath, content, {
    encoding: 'utf8',
  });
};
