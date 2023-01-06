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
        version: '9',
        gitUrl: 'https://github.com/codebuddy-pvt-ltd/boilerplates-nestjs.git',
        command: 'cbd-gen -f nest -v 9 -n nest-9',
      },
    ],
  },
  {
    framework: 'laravel',
    versions: [
      {
        version: '9',
        gitUrl: 'https://github.com/codebuddy-pvt-ltd/boilerplates-laravel.git',
        command: 'cbd-gen -f laravel -v 9 -n laravel-9',
      },
    ],
  },
  {
    framework: 'next',
    versions: [
      {
        version: '13',
        gitUrl: 'https://github.com/codebuddy-pvt-ltd/boilerplates-next.git',
        command: 'cbd-gen -f next -v 13 -n next-13',
      },
    ],
  },
];

export default configs;
