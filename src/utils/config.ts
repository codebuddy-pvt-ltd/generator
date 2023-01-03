export type TFramework = 'laravel' | 'nest' | 'next';

export interface IConfig {
  framework: TFramework;
  versions: { version: string; gitUrl: string; command: string }[];
}

const configs: IConfig[] = [
  {
    framework: 'nest',
    versions: [
      {
        version: '5',
        gitUrl: 'https://github.com/codebuddyinterview/node',
        command: 'cbd-gen -f nest -v 5 -n nest-5',
      },
      {
        version: '6',
        gitUrl: 'https://github.com/codebuddyinterview/node',
        command: 'cbd-gen -f nest -v 6 -n nest-6',
      },
    ],
  },
  {
    framework: 'laravel',
    versions: [
      {
        version: '7',
        gitUrl: 'https://github.com/codebuddyinterview/node',
        command: 'cbd-gen -f laravel -v 7 -n laravel-7',
      },
      {
        version: '8',
        gitUrl: 'https://github.com/codebuddyinterview/node',
        command: 'cbd-gen -f laravel -v 8 -n laravel-8',
      },
    ],
  },
];

export default configs;
