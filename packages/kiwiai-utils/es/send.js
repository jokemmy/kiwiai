import { log } from './print'; // 信息状态

export var DONE = 'DONE';
export var STARTING = 'STARTING';
export var RESTART = 'RESTART';
export default function send(name, message) {
  var processSend = process.send;

  if (processSend) {
    log("Process[".concat(name, "]:send ").concat(JSON.stringify(message)));
    processSend(message);
  }
}