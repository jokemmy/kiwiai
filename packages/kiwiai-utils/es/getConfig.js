import path from 'path';
import JSON5 from 'json5';
import { existsSync, readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';
import { CONFIG_FILES, appDirectory } from './paths';
import { error, log, exit } from './print';
import mergeConfig from './mergeConfig';
export default function getConfig(defaultConfig) {
  var configuration = {}; // 找到文件

  var filePath = CONFIG_FILES.find(existsSync) || ''; // 没有配置文件报错

  if (!filePath && defaultConfig) {
    log("Use default configuration.");
    return defaultConfig;
  }

  log("Reading configuration: ".concat(filePath.replace(appDirectory, '<AppRoot>'))); // 读取文件

  try {
    if (path.extname(filePath) === '.js') {
      delete require.cache[filePath];
      configuration = require(filePath);
    } else {
      var fileContent = readFileSync(filePath, 'utf-8');
      configuration = JSON5.parse(stripJsonComments(fileContent));
    }
  } catch (err) {
    error(err);
    exit();
  }

  return mergeConfig(defaultConfig || {}, configuration);
}