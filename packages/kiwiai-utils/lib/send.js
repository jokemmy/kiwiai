"use strict";

exports.__esModule = true;
exports.default = send;
exports.RESTART = exports.STARTING = exports.DONE = void 0;

var _print = require("./print");

// 信息状态
var DONE = 'DONE';
exports.DONE = DONE;
var STARTING = 'STARTING';
exports.STARTING = STARTING;
var RESTART = 'RESTART';
exports.RESTART = RESTART;

function send(name, message) {
  var processSend = process.send;

  if (processSend) {
    (0, _print.log)("Process[".concat(name, "]:send ").concat(JSON.stringify(message)));
    processSend(message);
  }
}