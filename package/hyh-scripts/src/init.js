'use strict';

const checkAppEnv = require('../tool/check-app-env');
const {injectEnvIntoNode} = require('../tool/env');

const init = (actionType = 'start') => {
  return (options = {}) => {
    const {appEnv} = options;

    // 检测app-env是否合法
    if (appEnv) checkAppEnv(appEnv);

    // 注入环境变量
    process.env.APP_ENV = appEnv;
    switch (actionType) {
      case 'start':
        process.env.NODE_ENV = 'development';
        break;
      case 'build':
        process.env.NODE_ENV = 'production';
        break;
      case 'test':
        process.env.NODE_ENV = 'test';
        break;
    }
    injectEnvIntoNode();

    require(`./${actionType}`)(options);
  };
};

module.exports = init;
