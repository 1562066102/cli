'use strict';
const inquirer = require('inquirer');
const log = require('../tool/log');

const questions = [
  {
    name: 'name',
    message: '请输入项目名称？',
    default: 'web-app',
  },
  {
    name: 'description',
    message: '请输入项目描述？',
  },
  {
    name: 'author',
    message: '请输入作者？',
  },
  {
    name: 'template',
    type: 'list',
    message: '请选择模板',
    choices: ['react'],
  },
];

async function init() {
  log('欢迎使用hyh-cli，轻松构建项目🎉🎉🎉');
  const a = await inquirer.prompt(questions);
  console.log(a);
}

module.exports = init;
