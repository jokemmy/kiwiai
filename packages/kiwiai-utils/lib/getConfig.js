"use strict";

exports.__esModule = true;
exports.default = getConfig;

var _path = _interopRequireDefault(require("path"));

var _json = _interopRequireDefault(require("json5"));

var _fs = require("fs");

var _stripJsonComments = _interopRequireDefault(require("strip-json-comments"));

var _paths = require("./paths");

var _print = require("./print");

var _mergeConfig = _interopRequireDefault(require("./mergeConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfig(defaultConfig) {
  var configuration = {}; // 找到文件

  var filePath = _paths.CONFIG_FILES.find(_fs.existsSync) || ''; // 没有配置文件报错

  if (!filePath && defaultConfig) {
    (0, _print.log)("Use default configuration.");
    return defaultConfig;
  }

  (0, _print.log)("Reading configuration: ".concat(filePath.replace(_paths.appDirectory, '<AppRoot>'))); // 读取文件

  try {
    if (_path.default.extname(filePath) === '.js') {
      delete require.cache[filePath];
      configuration = require(filePath);
    } else {
      var fileContent = (0, _fs.readFileSync)(filePath, 'utf-8');
      configuration = _json.default.parse((0, _stripJsonComments.default)(fileContent));
    }
  } catch (err) {
    (0, _print.error)(err);
    (0, _print.exit)();
  }

  return (0, _mergeConfig.default)(defaultConfig || {}, configuration);
}

module.exports = exports["default"];