#!/usr/bin/env node

'use strict';

const program = require('commander');
const start = require('../src/start');
const build = require('../src/build');
const test = require('../src/test');

program.version('1.0.0');

program.description('启动').command('start').action(start);

program.description('构建').command('build').action(build);

program
  .description('测试')
  .command('test')
  .option(
    '-d, --development',
    '开发环境 process.env.APP_ENV = "development"',
    true
  )
  .option('-t, --test', '测试环境 process.env.APP_ENV = "test"')
  .option('-r, --pre-release', '预发环境 process.env.APP_ENV = "preRelease"')
  .option('-p, --production', '生产环境 process.env.APP_ENV = "production"')
  .action(test);

program.parse(process.argv);
