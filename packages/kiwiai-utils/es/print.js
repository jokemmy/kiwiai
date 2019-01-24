function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

export function println() {
  for (var _len = arguments.length, messages = new Array(_len), _key = 0; _key < _len; _key++) {
    messages[_key] = arguments[_key];
  }

  if (messages.length > 0) {
    messages.forEach(function (message) {
      console.log(message);
    });
  } else {
    console.log();
  }
}
export function printError(error) {
  var text = error;

  if (_typeof(error) === 'object') {
    text = error.message;
  }

  console.log();
  console.log(text);
  console.log();
}