'use strict';

const Webpack = require('webpack');
const mergeWebpackConfig = require('../tool/merge');
const log = require('../tool/log');

function build() {
  log('building server...', 'cyan');
  const config = mergeWebpackConfig();
  Webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err);
    }
    console.log('处理完成');
  });
}

module.exports = build;
