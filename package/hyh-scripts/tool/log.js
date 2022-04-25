'use strict';

const chalk = require('chalk');

const log = (content, color = 'green') => {
  return console.log(chalk[color](content));
};

module.exports = log;
