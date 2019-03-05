import { log } from './print'; // 信息状态

export var DONE = 'DONE';
export var STARTING = 'STARTING';
export var RESTART = 'RESTART';
var processName = 'Child';
export function setProcessName(name) {
  if (name) {
    processName = name;
  } else {
    log("Process name not found, will use default name: ".concat(processName));
  }
}
export function send(data) {
  var processSend = process.send;

  if (processSend) {
    log("Process[".concat(processName, "]:send ").concat(JSON.stringify(data)));
    processSend(data);
  }
}