'use strict';

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
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
    choices: [],
  },
];

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
  // process.chdir(targetPath);
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
  log('-------- generating -------');
  const sourcePath = path.join(__dirname, `../template/${answer.template}`);
  const targetPath = await createTargetDir(answer.name);
  await copy(sourcePath, targetPath);
  log('-------- generated -------');
}

module.exports = init;
