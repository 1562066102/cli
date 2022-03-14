#!/usr/bin/env node

'use strict';

const program = require('commander');
const init = require('../src/init');

program.version('1.0.0');

program.command('init').description('构建项目').action(init);

program.parse(process.argv);
