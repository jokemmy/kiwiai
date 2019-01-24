import path from 'path';
import JSON5 from 'json5';
import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';
import mergeConfig from './mergeConfig';
import { CONFIG_FILES } from './paths';
import { printError } from './print';
export default function getConfig(defaultConfig) {
  var config = {}; // 找到文件

  var configPath = CONFIG_FILES.find(existsSync) || '';
  var ext = path.extname(configPath); // 没有配置文件报错

  if (!configPath) {
    printError(chalk.green('Config not found.'));
    return null;
  } // 读取文件


  if (ext === '.js') {
    delete require.cache[configPath];
    config = require(configPath); // eslint-disable-line
  } else {
    var fileContent = readFileSync(configPath, 'utf-8');
    config = JSON5.parse(stripJsonComments(fileContent));
  }

  return mergeConfig(defaultConfig || {}, config);
}