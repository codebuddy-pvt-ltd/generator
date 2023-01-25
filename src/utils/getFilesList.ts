import fs, { PathLike } from 'fs';
import path from 'path';

function* walkSync(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}

export const getFilesList = (dir: string) => {
  const files = [];
  for (const filePath of walkSync(dir)) {
    files.push(filePath.replace(`${dir}/`, ''));
  }

  return files;
};
