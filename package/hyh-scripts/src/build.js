'use strict';

const Webpack = require('webpack');
const mergeWebpackConfig = require('../tool/merge');

const nodeEnv = 'production';

function build() {
  process.env.NODE_ENV = nodeEnv;
  console.log('building server...');
  const config = mergeWebpackConfig(nodeEnv);
  Webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err);
    }
    console.log('处理完成');
  });
}

module.exports = build;
