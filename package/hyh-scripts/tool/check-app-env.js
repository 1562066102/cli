'use strict';

const log = require('./log');

const checkAppEnv = env => {
  const validEnvs = ['development', 'test', 'release', 'production'];
  const isValidEnv = validEnvs.includes(env);
  if (!isValidEnv) {
    log(`error 环境变量错误，请指定以下合法值\n${validEnvs.join('\n')}`, 'red');
    process.exit(1);
  }
};

module.exports = checkAppEnv;
