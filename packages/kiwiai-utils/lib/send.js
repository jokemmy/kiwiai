"use strict";

exports.__esModule = true;
exports.setProcessName = setProcessName;
exports.send = send;
exports.RESTART = exports.STARTING = exports.DONE = void 0;

var _print = require("./print");

// 信息状态
var DONE = 'DONE';
exports.DONE = DONE;
var STARTING = 'STARTING';
exports.STARTING = STARTING;
var RESTART = 'RESTART';
exports.RESTART = RESTART;
var processName = 'Child';

function setProcessName(name) {
  if (name) {
    processName = name;
  } else {
    (0, _print.log)("Process name not found, will use default name: ".concat(processName));
  }
}

function send(data) {
  var processSend = process.send;

  if (processSend) {
    (0, _print.log)("Process[".concat(processName, "]:send ").concat(JSON.stringify(data)));
    processSend(data);
  }
}