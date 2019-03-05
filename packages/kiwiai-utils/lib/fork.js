"use strict";

exports.__esModule = true;
exports.default = void 0;

var _child_process = require("child_process");

var _send = require("./send");

var _print = require("./print");

// nodejs 调试参数 --inspect-brk 程序开始短点
//                 --inspect
var usedPorts = [];

function forkChild(name, path) {
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


  var argvs = process.argv.slice(2); // 调试功能

  if (process.env.NODE_ENV === 'development') {
    (0, _print.log)("Forking ".concat(process.env.NODE_ENV, " server: ").concat(name)); // 找 name 参数

    var pName = "-name=".concat(name);
    var nameArgvIndex = argvs.findIndex(function (argv) {
      return argv.includes('-name=');
    });

    if (nameArgvIndex > -1) {
      argvs.splice(nameArgvIndex, 1, argvs[nameArgvIndex].replace(/^-name=/, pName));
    } // 没有就添加
    else if (nameArgvIndex === -1) {
        argvs.push(pName);
      } // 设置进程名字方便调试


    (0, _send.setProcessName)(name);
  }

  var childProcess = (0, _child_process.fork)(path, argvs, {
    execArgv: execArgv
  });
  childProcess.on('message', function (data) {
    // 如果自己用不上就向父进程传递消息
    // 对消息做出相应的操作
    if ((data === null || data === void 0 ? void 0 : data.type) === _send.RESTART) {
      childProcess.kill();
      forkChild(name, path);
    }

    (0, _send.send)(data);
  });
}

var _default = forkChild;
exports.default = _default;
module.exports = exports["default"];