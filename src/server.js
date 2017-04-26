
import Task from 'data.task';
import { Left, Right } from 'data.either';
import { chain, map } from 'control.monads';
import chalk from 'chalk';
import webpack from 'webpack';
import chokidar from 'chokidar';
import detect from 'detect-port';
import WebpackDevServer from 'webpack-dev-server';
import historyApiFallback from 'connect-history-api-fallback';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';

import paths from './utils/paths';
import print from './utils/print';
import compose from './utils/compose';
import getConfig from './utils/getConfig';
import compiler from './compiler';
import devServer from './devServer';

// develop server
process.env.NODE_ENV = 'development';

const DEFAULT_PORT = 8000;
const SEVER_CONFIG = 'kiwi.config.js';
const WEBPACK_CONFIG = 'webpack.config.dev.js';

const severConfig = paths.resolveApp( SEVER_CONFIG );
const webpackConfig = paths.resolveApp( WEBPACK_CONFIG );
const watchFiles = [ severConfig ];

const proxy = require( paths.appPackageJson ).proxy;  // eslint-disable-line
const server = {
  paths, proxy, watchFiles,
  port: DEFAULT_PORT,
  env: process.env.NODE_ENV,
  isInteractive: process.stdout.isTTY
};

// read config for develop server
function readServerConfig ( server ) {
  try {
    const severConfig = getConfig( severConfig );
    return Right( Object.assign( server,  ));
  } catch ( e ) {
    print(
      chalk.red( `Failed to read ${SEVER_CONFIG}.` ),
      e.message
    );
    return Left( null );
  }
}


// read config for webpack dev server
function readWebpackConfig ( server ) {
  const devConfig = server.webpackConfig && server.webpackConfig.dev;
  const configFile = paths.resolveApp( devConfig ) || webpackConfig;
  try {
    server.webpackConfig = getConfig( configFile );
    watchFiles.push( configFile );
    return Right( server );
  } catch ( e ) {
    print(
      chalk.red( `Failed to read ${devConfig || WEBPACK_CONFIG}.` ),
      e.message
    );
    return Left( null );
  }
}


// function setupCompiler ( server ) {

//   const host = process.env.HOST || 'localhost';
//   const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
//   const { isInteractive, port, webpackConfig } = server;
//   const compiler = webpack( webpackConfig );

//   compiler.plugin( 'invalid', () => print( 'Compiling...' ));

//   let isFirstCompile = true;
//   compiler.plugin( 'done', function ( stats ) {

//     clearConsole();
//     const messages = formatWebpackMessages( stats.toJson( {}, true ));
//     const isSuccessful = !messages.errors.length && !messages.warnings.length;
//     const showInstructions = isSuccessful && ( isInteractive || isFirstCompile );

//     if ( isSuccessful ) {
//       print( chalk.green( 'Compiled successfully!' ))
//     }

//     if ( showInstructions ) {
//       print(
//         'The server is running at:',
//         `  ${chalk.cyan( `${protocol}://${host}:${port}/` )}`,
//         'Note that the development build is not optimized.',
//         `To create a production build, use ${chalk.cyan( 'npm run build' )}.`
//       );
//       isFirstCompile = false;
//     }

//     // If errors exist, only show errors.
//     if ( messages.errors.length ) {
//       print( chalk.green( 'Failed to compile.' ));
//       messages.errors.forEach( print );

//     // Show warnings if no errors were found.
//     } else if ( messages.warnings.length ) {
//       print( chalk.yellow( 'Compiled with warnings.' ));
//       messages.warnings.forEach( print );

//       // Teach some ESLint tricks.
//       // console.log( 'You may use special comments to disable some warnings.' );
//       // console.log( `Use ${chalk.yellow('// eslint-disable-next-line')} to ignore the next line.` );
//       // console.log( `Use ${chalk.yellow('/* eslint-disable */')} to ignore all warnings in a file.` );
//       // console.log();
//     }

//     // if (isInteractive) {
//     //   outputMockError();
//     // }
//   });

//   server.compiler = compiler;
//   return server;
// }



// function addMiddleware ( server ) {
//   const { proxy, devServer } = server;
//   devServer.use( historyApiFallback({
//     disableDotRule: true,
//     htmlAcceptHeaders: proxy ? [ 'text/html' ] : [ 'text/html', '*/*' ],
//   }));
//   // TODO: proxy index.html, ...
//   devServer.use( devServer.middleware );
// }


// function setupWatch ( server ) {
//   const { devServer, svConfig, paths } = server;
//   const files = defaultWatchFiles.concat( paths.resolveApp( svConfig.theme ) || [] );
//   const watcher = chokidar.watch( files, {
//     ignored: /node_modules/,
//     persistent: true,
//   } );
//   watcher.on( 'change', ( path ) => {
//     console.log( chalk.green( `File ${path.replace( paths.appDirectory, '.' )} changed, try to restart server` ) );
//     watcher.close();
//     devServer.close();
//     process.send( 'RESTART' );
//   } );
//   return server;
// }


// function runDevServer ( server ) {

//   const host = process.env.HOST || 'localhost';
//   const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
//   const { compiler, port, webpackConfig, svConfig } = server;
//   const devServer = new WebpackDevServer( compiler, {
//     compress: true,
//     clientLogLevel: 'none',
//     contentBase: paths.appPublic,
//     hot: true,
//     publicPath: webpackConfig.output.publicPath,
//     quiet: true,
//     watchOptions: {
//       ignored: /node_modules/,
//     },
//     https: protocol === 'https',
//     host,
//     proxy: svConfig.proxy || {},
//   } );

//   server.devServer = devServer;
//   addMiddleware( server );
//   // applyMock( devServer );

//   devServer.listen( port, ( err ) => {

//     if ( err ) {
//       return console.log( err );
//     }

//     process.send( 'READY' );
//     clearConsole();
//     console.log( chalk.cyan( 'Starting the development server...' ) );
//     console.log();
//     // if (isInteractive) {
//     //   outputMockError();
//     // }

//   } );

//   setupWatch( server );
//   return server;
// }


// 检查端口占用
function portChecker( server ) {
  return new Task( function( result ) {
    detect( server.port ).then( function( port ) {
      if ( port === server.port ) {
        result( server );
      } else {
        print( chalk.yellow( `Something is already running on port ${port}.` ) );
      }
    });
  });
}


compose( chain( portChecker ), readServerConfig )( server ).fork(
  compose( map( devServer ), map( compiler ), readWebpackConfig )
);

