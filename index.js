#!/usr/bin/env node

var currentNodeVersion = process.versions.node;
var [major, minor] = currentNodeVersion.split('.');

if (major < 12 && minor < 10) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'create-nwb-app requires Node 12.10 or higher. \n' +
      'Please update your version of Node.'
  );
  process.exit(1);
}

require('./build/node');
