"use strict";

exports.__esModule = true;
exports.default = getConfig;

var _path = _interopRequireDefault(require("path"));

var _json = _interopRequireDefault(require("json5"));

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = require("fs");

var _stripJsonComments = _interopRequireDefault(require("strip-json-comments"));

var _mergeConfig = _interopRequireDefault(require("./mergeConfig"));

var _paths = require("./paths");

var _print = require("./print");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfig(defaultConfig) {
  var config = {}; // 找到文件

  var configPath = _paths.CONFIG_FILES.find(_fs.existsSync) || '';

  var ext = _path.default.extname(configPath); // 没有配置文件报错


  if (!configPath) {
    (0, _print.error)(_chalk.default.green('Config file not found: ${configPath}'));
    return null;
  }

  (0, _print.log)("Reading config file: ".concat(configPath)); // 读取文件

  try {
    if (ext === '.js') {
      delete require.cache[configPath];
      config = require(configPath);
    } else {
      var fileContent = (0, _fs.readFileSync)(configPath, 'utf-8');
      config = _json.default.parse((0, _stripJsonComments.default)(fileContent));
    }
  } catch (err) {
    (0, _print.error)(err);
  }

  return (0, _mergeConfig.default)(defaultConfig || {}, config);
}

module.exports = exports["default"];