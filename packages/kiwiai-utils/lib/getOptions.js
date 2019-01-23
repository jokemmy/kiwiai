"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getOptions;

var _path = _interopRequireDefault(require("path"));

var _json = _interopRequireDefault(require("json5"));

var _chalk = _interopRequireDefault(require("chalk"));

var _assert = _interopRequireDefault(require("assert"));

var _fs = require("fs");

var _stripJsonComments = _interopRequireDefault(require("strip-json-comments"));

var _paths = require("./paths");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function test() {
  var defaultConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  console.log("defaultConfig:", defaultConfig);
}

test();
test(null);

function getOptions() {
  var defaultConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // 找到文件
  var configPath = _paths.CONFIG_FILES.find(_fs.existsSync) || '';

  var ext = _path.default.extname(configPath); // 没有配置文件报错


  (0, _assert.default)(!!configPath, _chalk.default.green('Config not found.')); // 读取文件

  var config = defaultConfig;

  if (ext === '.js') {
    delete require.cache[configPath];
    config = require(configPath); // eslint-disable-line
  } else {
    var fileContent = (0, _fs.readFileSync)(configPath, 'utf-8');
    config = _json.default.parse((0, _stripJsonComments.default)(fileContent));
  }
}

module.exports = exports["default"];