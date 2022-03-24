'use strict';

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const mergeWebpackConfig = require('../tool/merge');

const nodeEnv = 'development';

function start() {
  process.env.NODE_ENV = nodeEnv;
  console.log('starting server...');
  const config = mergeWebpackConfig(nodeEnv);
  const compiler = Webpack(config);
  const server = new WebpackDevServer({...config.devServer}, compiler);
  server.startCallback(() => {
    const localIPv4 = WebpackDevServer.internalIPSync('v4');
    console.log('Successfully started server on http://localhost:8080');
    console.log(localIPv4);
  });
}

module.exports = start;
