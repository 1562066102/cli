'use strict';

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../config/webpack.config');

function start() {
  console.log('starting server...');
  const compiler = Webpack(webpackConfig);
  const server = new WebpackDevServer({...webpackConfig.devServer}, compiler);
  server.startCallback(() => {
    const localIPv4 = WebpackDevServer.internalIPSync('v4');
    console.log('Successfully started server on http://localhost:8080');
    console.log(localIPv4);
  });
}

module.exports = start;
