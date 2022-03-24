'use strict';

const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

/** 当前node进程工作路径 */
const workPath = process.cwd();

module.exports = {
  entry: path.resolve(workPath, 'main.js'),
  output: {
    filename: 'static/js/[name].[contenthash:8].js',
    path: path.resolve(workPath, 'dist'),
    clean: true,
    assetModuleFilename: 'static/media/[name].[hash:8][ext]', // 资源路径
  },
  stats: 'errors-only',
  infrastructureLogging: {
    level: 'warn',
  },
  resolve: {
    alias: {
      '@': path.resolve(workPath, 'src'),
    },
    extensions: ['.tsx', '.ts', 'jsx', '.js'], // 尝试按顺序解析这些后缀名 使用户在引入模块时不带扩展名
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
  },
  module: {
    rules: [
      {
        test: /\.txt$/i,
        type: 'asset/source',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024, // 低于2kb采用inline，否则采用resource
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(sass|scss)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/i,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              [
                require.resolve('@babel/preset-react'),
                {
                  runtime: 'automatic',
                },
              ],
              require.resolve('@babel/preset-typescript'),
            ],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // 生成html，并自动注入scripts
    new HtmlWebpackPlugin({
      title: 'Web App',
      inject: true,
      template: './public/index.html',
    }),
    // 复制public静态资源
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(workPath, 'public'),
          to: path.resolve(workPath, 'dist'),
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    // webpack日志美化
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:8080'],
        notes: ['Some additional notes'],
      },
      clearConsole: true,
    }),
    // 全局变量注入
    new Webpack.DefinePlugin({
      BASE_URL: '"./"',
      'process.env.NODE_ENV': '"development"',
      'process.env.DEBUG': 'true',
    }),
  ],
};
