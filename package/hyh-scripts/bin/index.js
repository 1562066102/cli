#!/usr/bin/env node

'use strict';

const program = require('commander');
const init = require('../src/init');

program.version('1.0.0');

program
  .description('启动')
  .command('start')
  .option(
    '-a, --app-env <type>',
    `指定业务环境，可选值:
    development
    test
    release
    production
    `,
    'development'
  )
  .action(init('start'));

program
  .description('构建')
  .command('build')
  .option(
    '-a, --app-env <type>',
    `指定业务环境，可选值:
    development
    test
    release
    production
    `,
    'development'
  )
  .action(init('build'));

program.description('测试').command('test').action(init('test'));

program.parse(process.argv);
