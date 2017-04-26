
import clearConsole from 'react-dev-utils/clearConsole';

function clearConsoleWrapped() {
  process.env.CLEAR_CONSOLE !== 'NONE' &&
  clearConsole();
}

module.exports = clearConsoleWrapped;
