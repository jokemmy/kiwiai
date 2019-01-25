import kwaDebug from 'debug';
export var debug = kwaDebug('KWA');
export function log() {
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
export function error(error) {
  var text = error;

  if (error instanceof Error) {
    text = error.stack || error.message;
  }

  console.log("text:", text);
  debug();
  debug(text);
  debug();
}