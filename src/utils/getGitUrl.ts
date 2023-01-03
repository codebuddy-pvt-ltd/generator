import configs from './config';

export default function (framework: string, version: string) {
  return configs
    .find((f) => f.framework === framework)
    ?.versions.find((v) => v.version === String(version))?.gitUrl;
}
