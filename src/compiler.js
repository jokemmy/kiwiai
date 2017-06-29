
import chalk from 'chalk';
import webpack from 'webpack';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import clearConsole from './utils/clearConsole';
import print from './utils/print';

export default function( server ) {

  const host = process.env.HOST || 'localhost';
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const { isInteractive, port, webpackDevConfig } = server;
  const compiler = webpack( webpackDevConfig );

  clearConsole();
  compiler.plugin( 'invalid', () => print( 'Compiling...' ));

  let isFirstCompile = true;
  compiler.plugin( 'done', ( stats ) => {

    clearConsole();
    const messages = formatWebpackMessages( stats.toJson({}, true ));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    const showInstructions = isSuccessful && ( isInteractive || isFirstCompile );

    if ( isSuccessful ) {
      print( chalk.green( 'Compiled successfully!' ));
    }

    if ( showInstructions ) {
      print( `The server is running at: ${chalk.cyan( `${protocol}://${host}:${port}/` )}` );
      print( chalk.blue( 'Enjoy!' ));
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if ( messages.errors.length ) {
      print( chalk.green( 'Failed to compile.' ));
      messages.errors.forEach(( message ) => print( message ));

    // Show warnings if no errors were found.
    } else if ( messages.warnings.length ) {
      print( chalk.yellow( 'Compiled with warnings.' ));
      messages.warnings.forEach(( message ) => print( message ));

    }
  });

  server.compiler = compiler;
  return server;
}
