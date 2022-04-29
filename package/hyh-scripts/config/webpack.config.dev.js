'use strict';

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const port = process.env.PORT || 80;

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // static: './abc',
    open: true,
    port,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  plugins: [
    // webpack日志美化
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:8080'],
        notes: ['Some additional notes'],
      },
      clearConsole: true,
    }),
  ],
};
