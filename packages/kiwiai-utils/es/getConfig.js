import path from 'path';
import JSON5 from 'json5';
import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';
import mergeConfig from './mergeConfig';
import { CONFIG_FILES } from './paths';
import { error, log } from './print';
export default function getConfig(defaultConfig) {
  var config = {}; // 找到文件

  var configPath = CONFIG_FILES.find(existsSync) || '';
  var ext = path.extname(configPath); // 没有配置文件报错

  if (!configPath) {
    error(chalk.green('Config file not found: ${configPath}'));
    return null;
  }

  log("Reading config file: ".concat(configPath)); // 读取文件

  try {
    if (ext === '.js') {
      delete require.cache[configPath];
      config = require(configPath);
    } else {
      var fileContent = readFileSync(configPath, 'utf-8');
      config = JSON5.parse(stripJsonComments(fileContent));
    }
  } catch (err) {
    error(err);
  }

  return mergeConfig(defaultConfig || {}, config);
}