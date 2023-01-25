import fs, { PathLike } from 'fs';
import fetch from 'node-fetch';

export const download = async (url: string, name: PathLike) => {
  const res = await fetch(url);
  await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(name);
    res.body.pipe(fileStream);
    res.body.on('error', (err) => {
      reject(err);
    });
    fileStream.on('finish', function () {
      resolve('Done');
    });
  });
};
