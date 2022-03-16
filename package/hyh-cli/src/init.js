'use strict';

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const inquirer = require('inquirer');
const {spawn} = require('child_process');
const which = require('which');
const log = require('../tool/log');

/** 交互问题列表 */
const questions = [
  {
    name: 'name',
    message: '请输入项目名称？',
    default: 'web-app',
    validate(value) {
      const done = this.async();
      const reg = new RegExp(
        '^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$'
      );
      if (!reg.test(value)) return void done('名称包含非法字符!!!');
      done(null, true);
    },
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
    choices: [],
  },
];

/**
 * 运行npm/yarn脚本命令（通过子进程）
 * @param {string[]} args 命令参数
 * @return {Promise<number>}
 */
function runNpmCommand(args, useYarn = true) {
  return new Promise((resolve, reject) => {
    const npm = which.sync(process.platform === 'win32' ? 'npm.cmd' : 'npm');
    const yarn = which.sync('yarn');
    const runner = spawn(useYarn ? yarn : npm, args, {stdio: 'inherit'});
    runner.on('close', resolve);
    runner.on('error', reject);
  });
}

/**
 * 更新package.json文件
 * @param {string} path
 * @param {object} options
 * @return {Promise<void>}
 */
async function updatePackageJSON(filePath, options = {}) {
  const data = await fsPromises.readFile(filePath);
  const jsonData = {
    ...options,
    ...JSON.parse(data.toString()),
    template: undefined,
  };
  await fsPromises.writeFile(filePath, JSON.stringify(jsonData, null, 2));
}

/**
 * 复制文件（采用计数法）
 * @param {string} targetPath 目标路径
 * @param {string} sourcePath 源路径
 * @return {Promise<void>}
 */
function copy(sourcePath, targetPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(sourcePath, (error, files) => {
      let count = 0;
      const callback = () => {
        ++count === files.length && resolve();
      };
      if (error) return reject(error);
      files.forEach(file => {
        const originPath = path.join(sourcePath, file);
        const newPath = path.join(targetPath, file);
        fs.stat(originPath, (error, stat) => {
          if (error) return reject(error);
          // 目录
          if (stat.isDirectory()) {
            fs.mkdir(newPath, error => {
              if (error) return reject(error);
              log(`生成文件夹: ${newPath}`);
              copy(originPath, newPath).then(callback).catch(reject);
            });
            return;
          }
          // 文件
          const readSteam = fs.createReadStream(originPath);
          const writeSteam = fs.createWriteStream(newPath);
          writeSteam.on('close', error => {
            if (error) return reject(error);
            log(`生成文件: ${newPath}`);
            callback();
          });
          readSteam.pipe(writeSteam);
        });
      });
      files.length === 0 && resolve();
    });
  });
}

/**
 * 创建目标目录
 * @param {string} targetDirName 目录名
 * @return {Promise<string>} 目标目录路径
 */
async function createTargetDir(targetDirName) {
  const targetPath = path.join(process.cwd(), targetDirName);
  await fsPromises.mkdir(targetPath);
  return targetPath;
}

/** 查询现有模板目录列表 */
async function findTemplates() {
  return await fsPromises.readdir(path.join(__dirname, '../template'));
}

/** 初始化入口函数 */
async function init() {
  log('欢迎使用hyh-cli，轻松构建项目🎉🎉🎉');
  const templates = await findTemplates();
  const answer = await inquirer.prompt(
    questions.map(item => {
      if (item.name === 'template') return {...item, choices: templates};
      return {...item};
    })
  );

  log('\n\n-------- generating -------');
  const sourcePath = path.join(__dirname, `../template/${answer.template}`);
  const targetPath = await createTargetDir(answer.name);
  const packageJSONPath = path.join(targetPath, 'package.json');
  await copy(sourcePath, targetPath);
  await updatePackageJSON(packageJSONPath, answer);
  log('-------- generated -------');

  log('\n\n-------- Installing -------');
  process.chdir(targetPath);
  await runNpmCommand(['install']);
  log('-------- installed -------');

  log('\n\n现在愉快的开发吧🎉🎉🎉');
}

module.exports = init;
