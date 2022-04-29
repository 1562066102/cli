'use strict';

const fs = require('fs');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const paths = require('./paths');

delete require.cache[require.resolve('./paths')];

/** 往node中注入环境变量
 * @description 包含本地、客户端env文件中的环境变量（仅包含 .env .env.development .env.production）
 */
const injectEnvIntoNode = () => {
  const envPath = paths.env;
  [`${envPath}.${process.env.NODE_ENV}`, `${envPath}`]
    .filter(path => fs.existsSync(path))
    .forEach(path => {
      dotenvExpand.expand(dotenv.config({path}));
    });
};

/** 获取客户端环境变量 */
const getClientEnv = () => {
  const {NODE_ENV, APP_ENV} = process.env;
  const raw = Object.keys(process.env)
    .filter(key => /^REACT_APP_/.test(key))
    .reduce(
      (obj, key) => {
        obj[key] = process.env[key];
        return obj;
      },
      {
        // 程序执行环境
        NODE_ENV,
        // 业务运行环境
        APP_ENV,
        // public文件夹的路径（暂时固定）
        PUBLIC_URL: '/',
      }
    );

  // 转换成DefinePlugin所需的格式
  const env = {
    'process.env': Object.keys(raw).reduce((obj, key) => {
      obj[key] = JSON.stringify(raw[key]);
      return obj;
    }, {}),
  };

  return env;
};

module.exports = {
  injectEnvIntoNode,
  getClientEnv,
};
