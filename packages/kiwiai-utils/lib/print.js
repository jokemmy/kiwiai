"use strict";

exports.__esModule = true;
exports.exit = exit;
exports.log = log;
exports.error = error;
exports.debug = void 0;

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug.default)('KWA');
exports.debug = debug;

function exit(message) {
  if (message) {
    debug(message);
  }

  process.exit(0);
}

function log() {
  for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
    messages[_key] = arguments[_key];
  }

  if (messages.length > 0) {
    messages.forEach(function (message) {
      debug(message);
    });
  } else {
    debug();
  }
}

function error(error) {
  var text = error;

  if (error instanceof Error) {
    text = error.stack || error.message;
  }

  debug('');
  debug(text);
  debug('');
}