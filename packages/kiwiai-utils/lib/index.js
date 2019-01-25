"use strict";

exports.__esModule = true;
exports.babelRegister = exports.getConfig = exports.compose = exports.debug = exports.fork = void 0;

var _fork = _interopRequireDefault(require("./fork"));

var _print = require("./print");

var _compose = _interopRequireDefault(require("./compose"));

var _getConfig = _interopRequireDefault(require("./getConfig"));

var _babelRegister = _interopRequireDefault(require("./babelRegister"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fork = _fork.default;
exports.fork = fork;
var debug = _print.debug;
exports.debug = debug;
var compose = _compose.default;
exports.compose = compose;
var getConfig = _getConfig.default;
exports.getConfig = getConfig;
var babelRegister = _babelRegister.default;
exports.babelRegister = babelRegister;