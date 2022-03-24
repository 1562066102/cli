'use strict';

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    open: true,
    port: 8080,
    hot: true,
  },
};
