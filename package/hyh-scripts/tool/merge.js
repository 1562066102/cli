'use strict';

const path = require('path');
const {merge} = require('webpack-merge');
const webpackConfig = require('../config/webpack.config');
const webpackDevConfig = require('../config/webpack.config.dev');
const webpackProdConfig = require('../config/webpack.config.prod');

/** 合并webpack配置 */
function mergeWebpackConfig(mode = 'development') {
  let customWebpackConfig = {};
  try {
    const customWebpackConfigPath = path.resolve(
      process.cwd(),
      './hyh.config.js'
    );
    customWebpackConfig = require(customWebpackConfigPath);
  } catch (error) {
    // 无自定义配置文件
  }
  return merge(
    webpackConfig,
    mode === 'development' ? webpackDevConfig : webpackProdConfig,
    customWebpackConfig
  );
}

module.exports = mergeWebpackConfig;
