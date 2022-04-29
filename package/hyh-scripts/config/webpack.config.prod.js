'use strict';

const FileManagerPlugin = require('filemanager-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const paths = require('../tool/paths');

module.exports = {
  mode: 'production',
  plugins: [
    // 自动压缩生成zip文件
    new FileManagerPlugin({
      events: {
        onEnd: {
          delete: [`${paths.output}.zip`],
          archive: [{source: paths.output, destination: `${paths.output}.zip`}],
        },
      },
    }),
    // gzip压缩
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css/,
      threshold: 20480,
      minRatio: 0.8,
    }),
  ],
};
