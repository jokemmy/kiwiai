"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _child_process = require("child_process");

var _send = _interopRequireWildcard(require("./send"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// nodejs 调试参数 --inspect-brk 程序开始短点
//                --inspect
var usedPorts = [];

function forkChild(path) {
  // from af-webpack / fork
  // 重置调试器端口
  // 我感觉这个估计用不到
  var execArgv = process.execArgv.slice(0);
  var inspectArgvIndex = execArgv.findIndex(function (argv) {
    return argv.includes('--inspect-brk');
  }); // 重置端口加一

  if (inspectArgvIndex > -1) {
    var inspectArgv = execArgv[inspectArgvIndex];
    execArgv.splice(inspectArgvIndex, 1, inspectArgv.replace(/--inspect-brk=(.*)/, function (match_, s1) {
      var port;

      try {
        port = parseInt(s1) + 1;
      } catch (e) {
        port = 9230; // node default inspect port plus 1.
      }

      if (usedPorts.includes(port)) {
        port++;
      }

      usedPorts.push(port);
      return "--inspect-brk=".concat(port);
    }));
  } // 获取参数从第二个字符串开始


  var childProcess = (0, _child_process.fork)(path, process.argv.slice(2), {
    execArgv: execArgv
  });
  childProcess.on('message', function (data) {
    // 如果自己用不上就向父进程传递消息
    if (data && data.type === _send.RESTART) {
      childProcess.kill();
      forkChild(path);
    }

    (0, _send.default)(data);
  });
}

var _default = forkChild;
exports.default = _default;
module.exports = exports["default"];