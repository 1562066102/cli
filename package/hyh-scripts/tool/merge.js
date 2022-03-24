'use strict';

const path = require('path');
const {merge} = require('webpack-merge');
const webpackConfig = require('../config/webpack.config');
const webpackDevConfig = require('../config/webpack.config.dev');
const webpackProdConfig = require('../config/webpack.config.prod');

/** 合并webpack配置 */
function mergeWebpackConfig(mode = 'development') {
  try {
    const customWebpackConfigPath = path.resolve(
      process.cwd(),
      './hyh.config.js'
    );
    const customWebpackConfig = require(customWebpackConfigPath);
    return merge(
      webpackConfig,
      mode === 'development' ? webpackDevConfig : webpackProdConfig,
      customWebpackConfig
    );
  } catch (error) {
    // 无自定义配置文件
  }
}

module.exports = mergeWebpackConfig;
