"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOption = getOption;

var _chalk = _interopRequireDefault(require("chalk"));

var _assert = _interopRequireDefault(require("assert"));

var _fs = require("fs");

var _paths = require("./paths");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOption() {
  // 找到文件
  var configFilePath = _paths.CONFIG_FILES.find(_fs.existsSync); // 没有配置文件报错


  (0, _assert.default)(!!configFilePath, "File dlls.js is not exsit, please use ".concat(_chalk.default.cyan('npm run dll'), " first.")); // 读取文件
}