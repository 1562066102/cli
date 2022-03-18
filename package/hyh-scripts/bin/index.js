#!/usr/bin/env node

'use strict';

const program = require('commander');
const start = require('../src/start');
const build = require('../src/build');
const test = require('../src/test');

program.version('1.0.0');

program.command('start').description('启动').action(start);

program.command('build').description('构建').action(build);

program.command('test').description('测试').action(test);

program.parse(process.argv);
