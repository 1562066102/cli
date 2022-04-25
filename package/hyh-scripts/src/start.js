'use strict';

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const mergeWebpackConfig = require('../tool/merge');
const log = require('../tool/log');

function start() {
  log('starting server...', 'cyan');
  const config = mergeWebpackConfig();
  const compiler = Webpack(config);
  const server = new WebpackDevServer({...config.devServer}, compiler);
  server.startCallback(() => {
    // const localIPv4 = WebpackDevServer.internalIPSync('v4');
    // console.log('Successfully started server on http://localhost:8080');
    // console.log(localIPv4);
  });
}

module.exports = start;
