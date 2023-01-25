import archiver from 'archiver';
import fs from 'fs';

export const archive = (sourceDir: string, outPath: string) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false, (file: { name: string }) =>
        file.name.endsWith('.zip') ? false : file,
      )
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve(true));
    archive.finalize();
  });
};
