"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = send;
exports.RESTART = exports.STARTING = exports.DONE = void 0;

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var kwaDebug = (0, _debug.default)('kiwiai:send'); // 信息状态

var DONE = 'DONE';
exports.DONE = DONE;
var STARTING = 'STARTING';
exports.STARTING = STARTING;
var RESTART = 'RESTART';
exports.RESTART = RESTART;

function send(message) {
  var posSend = process.send;

  if (posSend) {
    kwaDebug("send ".concat(JSON.stringify(message)));
    posSend(message);
  }
}