import debug from 'debug';
var kwaDebug = debug('kiwiai:send'); // 信息状态

export var DONE = 'DONE';
export var STARTING = 'STARTING';
export var RESTART = 'RESTART';
export default function send(message) {
  var posSend = process.send;

  if (posSend) {
    kwaDebug("send ".concat(JSON.stringify(message)));
    posSend(message);
  }
}