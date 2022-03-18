'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

/** 当前node进程工作路径 */
const workPath = process.cwd();

module.exports = {
  entry: path.resolve(workPath, 'main.js'),
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(workPath, 'dist'),
    clean: true,
  },
  mode: 'development', // development production
  stats: 'errors-only',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    open: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack',
      inject: true,
      // public_path: '/',
      // favicon: './public/favicon.ico',
      template: './public/index.html',
    }),
    new FriendlyErrorsWebpackPlugin(),
  ],
};
