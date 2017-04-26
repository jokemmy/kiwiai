
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import clearConsole from './utils/clearConsole';

export default function( server ) {

  const host = process.env.HOST || 'localhost';
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const { isInteractive, port, webpackConfig } = server;
  const compiler = webpack( webpackConfig );

  compiler.plugin( 'invalid', () => print( 'Compiling...' ));

  let isFirstCompile = true;
  compiler.plugin( 'done', function ( stats ) {

    clearConsole();
    const messages = formatWebpackMessages( stats.toJson( {}, true ));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    const showInstructions = isSuccessful && ( isInteractive || isFirstCompile );

    if ( isSuccessful ) {
      print( chalk.green( 'Compiled successfully!' ))
    }

    if ( showInstructions ) {
      print(
        `The server is running at: ${chalk.cyan( `${protocol}://${host}:${port}/` )}`,
        'Note that the development build is not optimized.',
        `To create a production build, use ${chalk.cyan( 'npm run build' )}.`
      );
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if ( messages.errors.length ) {
      print( chalk.green( 'Failed to compile.' ));
      messages.errors.forEach( print );

    // Show warnings if no errors were found.
    } else if ( messages.warnings.length ) {
      print( chalk.yellow( 'Compiled with warnings.' ));
      messages.warnings.forEach( print );

      // Teach some ESLint tricks.
      // console.log( 'You may use special comments to disable some warnings.' );
      // console.log( `Use ${chalk.yellow('// eslint-disable-next-line')} to ignore the next line.` );
      // console.log( `Use ${chalk.yellow('/* eslint-disable */')} to ignore all warnings in a file.` );
      // console.log();
    }

    // if (isInteractive) {
    //   outputMockError();
    // }
  });

  server.compiler = compiler;
  return server;
}