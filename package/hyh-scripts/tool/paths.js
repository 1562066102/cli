'use strict';

const fs = require('fs');
const path = require('path');

const appRootDir = process.cwd();

const analyseAppPath = relativePath => path.resolve(appRootDir, relativePath);

const analyseUnknownExtensionPath = relativePath => {
  const extensions = ['mjs', 'js', 'ts', 'jsx', 'tsx', 'json'];
  const extension = extensions.find(extension =>
    fs.existsSync(`${relativePath}.${extension}`)
  );
  return analyseAppPath(`${relativePath}.${extension || 'js'}`);
};

const buildPath = process.env.BUILD_PATH || 'dist';

const paths = {
  env: analyseAppPath('.env'),
  entry: analyseUnknownExtensionPath('src/index'),
  output: analyseAppPath(buildPath),
  src: analyseAppPath('src'),
  public: analyseAppPath('public'),
  html: analyseAppPath('public/index.html'),
};

module.exports = paths;
