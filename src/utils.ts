/**
 * loose port of
 * https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/init.js
 */
import { moveSync, copySync } from 'https://deno.land/std/fs/mod.ts';
import { resolve } from 'https://deno.land/std/path/mod.ts';

import { exec } from 'https://deno.land/x/execute/mod.ts';

const {
  chmodSync,
  removeSync,
  build: { os },
} = Deno;

export const clone = async (url: string, name: string) => {
  // eslint-disable-next-line no-console
  console.log(`Cloning repository ${url}...`);

  await exec({
    cmd: ['git', 'clone', url, name],
  });
};

export const tryGitInit = async (path: string) => {
  try {
    // eslint-disable-next-line no-console
    console.log('\nSetting up new repository...');

    const gitPath = resolve(path, '.git');

    // currently not implemented for windows
    if (os !== 'windows') {
      chmodSync(gitPath, 0o777);
      removeSync(gitPath, { recursive: true });
    } else {
      moveSync(gitPath, resolve(path, '__oldGit'));

      // eslint-disable-next-line no-console
      console.warn(
        `Cannot remove .git repository on windows. Please remove the leftover "__oldGit" folder yourself.`
      );
    }

    await exec({
      cmd: ['git', 'init'],
      cwd: path,
    });

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Git repo not initialized:', error.message);

    return false;
  }
};

export const tryGitCommit = async (path: string) => {
  try {
    await exec({
      cmd: ['git', 'add', '-A'],
      cwd: path,
    });

    await exec({
      cmd: [
        'git',
        'commit',
        '--no-verify', // skip commitlint rules here
        '-m',
        '"Initialize project using create-nwb-app"',
      ],
      cwd: path,
    });

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Git commit not created:', error.message);

    return false;
  }
};

export const install = async (cwd: string, useNpm: boolean = false) => {
  // eslint-disable-next-line no-console
  console.log('\nInstalling dependencies...');

  const cmd = [useNpm ? 'npm' : 'yarn', 'install'];

  console.log({ cmd });

  await exec({
    cmd,
    cwd,
  });

  if (useNpm) {
    removeSync(resolve(cwd, 'yarn.lock'));
  }

  // eslint-disable-next-line no-console
  console.log('Finished installing dependencies!');
};

export const copyEnv = (path: string) => {
  // eslint-disable-next-line no-console
  console.log('Moving .env file...');
  copySync(resolve(path, '.env.example'), resolve(path, '.env'));
};
