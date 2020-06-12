/* eslint-disable no-console */
import { existsSync } from 'https://deno.land/std/fs/mod.ts';
import { resolve } from 'https://deno.land/std/path/mod.ts';
import { Lizard, program } from 'https://deno.land/x/denomander/bootstrap.ts';

import {
  options,
  defaultTemplate,
  description,
  name,
  version,
  command,
  makeUrl,
} from './common.ts';
import { clone, tryGitInit, tryGitCommit, install, copyEnv } from './utils.ts';

const { removeSync, cwd, exit } = Deno;

const init = async () => {
  const template = program.template || defaultTemplate;
  const projectName =
    program.template || `next-with-batteries-${defaultTemplate}`;

  if (existsSync(projectName)) {
    console.error(
      `A folder with the name
>>> "${projectName}"
already exists.

Please rename or remove it before trying again.`
    );

    exit(1);
  }

  const workingDirectory = resolve(cwd(), projectName);
  // const url = makeUrl(template);
  const url = 'https://github.com/ljosberinn/personal-react-boilerplate.git';
  try {
    await clone(url, workingDirectory);

    const gitInitialized = await tryGitInit(workingDirectory);

    copyEnv(workingDirectory);
    await install(workingDirectory, program['use-npm']);

    if (gitInitialized) {
      await tryGitCommit(workingDirectory);
    }
  } catch (error) {
    console.warn(`An error occured during project initialization.
Please ensure that
  - the template exists: "${url}"
  - you're online

Error: "${error.message}"
  `);

    // rollback
    try {
      removeSync(projectName, { recursive: true });
    } catch {
      console.error(
        'Could not rollback entirely due to a lack of permissions.'
      );
    }
  }
};

Lizard.appDetails({
  app_description: description,
  app_name: name,
  app_version: version,
}).command(command, init);

options.forEach(({ description, arg }) => {
  program.option(arg, description);
});

Lizard.parse();
