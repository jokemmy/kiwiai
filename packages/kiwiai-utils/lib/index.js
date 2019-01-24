"use strict";

exports.__esModule = true;
exports.getConfig = exports.compose = exports.fork = void 0;

var _fork = _interopRequireDefault(require("./fork"));

var _compose = _interopRequireDefault(require("./compose"));

var _getConfig = _interopRequireDefault(require("./getConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fork = _fork.default;
exports.fork = fork;
var compose = _compose.default;
exports.compose = compose;
var getConfig = _getConfig.default;
exports.getConfig = getConfig;