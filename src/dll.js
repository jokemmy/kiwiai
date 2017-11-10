
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import webpack from 'webpack';
import filesize from 'filesize';
import flatten from 'arr-flatten';
import stripAnsi from 'strip-ansi';
import recursive from 'recursive-readdir';
import { sync as gzipSize } from 'gzip-size';
import is from './utils/is';
import print from './utils/print';
import paths from './utils/paths';
import getConfig from './utils/getConfig';

process.env.NODE_ENV = 'development';

const argv = require( 'yargs' ) // eslint-disable-line
  .usage( 'Usage: roadhog buildDll [options]' )
  .help( 'h' )
  .argv;

let rcConfig;
let appBuild;
let config;
let dllConfig;

function readConfig( pathToFile, fileName ) { // eslint-disable-line
  try {
    return getConfig( pathToFile );
  } catch ( e ) {
    print(
      chalk.red( `Failed to read ${fileName}.` ),
      e.message
    );
    print();
  }
}

export function build( argv ) { // eslint-disable-line

  appBuild = paths.dllNodeModule;
  rcConfig = readConfig( paths.appSeverConfig, paths.SEVER_CONFIG );
  dllConfig = ( rcConfig.webpackConfig && rcConfig.webpackConfig.dll ) || paths.WEBPACK_DLL_CONFIG;
  config = readConfig( paths.resolveApp( dllConfig ), dllConfig );

  // plugins: function
  if ( is.Function( config.plugins )) {
    config.plugins = config.plugins( config );
  }

  // plugins: not array
  if ( !is.Array( config.plugins )) {
    config.plugins = [config.plugins];
  }

  config.plugins = flatten( config.plugins.map(( plugin ) => {
    return is.Function( plugin ) ? plugin( config ) : plugin;
  }));

  return new Promise(( resolve ) => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    recursive( appBuild, ( err_, fileNames ) => {
      const previousSizeMap = ( fileNames || [])
        .filter( fileName => /\.(js|css)$/.test( fileName ))
        .reduce(( memo, fileName ) => {
          const contents = fs.readFileSync( fileName );
          const key = removeFileNameHash( fileName ); // eslint-disable-line
          memo[key] = gzipSize( contents );
          return memo;
        }, {});

      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      fs.emptyDirSync( appBuild );

      // Start the webpack build
      realBuild( previousSizeMap, resolve, argv ); // eslint-disable-line
    });
  });
}

// Input: /User/dan/app/build/static/js/main.82be8.js
// Output: /static/js/main.js
function removeFileNameHash( fileName ) {
  return fileName
    .replace( appBuild, '' )
    .replace( /\/?(.*)(\.\w+)(\.js|\.css)/, ( match_, p1, p2_, p3 ) => p1 + p3 );
}

// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel( currentSize, previousSize ) {
  const FIFTY_KILOBYTES = 1024 * 50;
  const difference = currentSize - previousSize;
  const fileSize = !Number.isNaN( difference ) ? filesize( difference ) : 0;
  if ( difference >= FIFTY_KILOBYTES ) {
    return chalk.red( `+${fileSize}` );
  } else if ( difference < FIFTY_KILOBYTES && difference > 0 ) {
    return chalk.yellow( `+${fileSize}` );
  } else if ( difference < 0 ) {
    return chalk.green( fileSize );
  }
  return '';

}

// Print a detailed summary of build files.
function printFileSizes( stats, previousSizeMap ) {
  const assets = stats.toJson().assets
    .filter( asset => /\.(js|css)$/.test( asset.name ))
    .map(( asset ) => {
      const fileContents = fs.readFileSync( `${appBuild}/${asset.name}` );
      const size = gzipSize( fileContents );
      const previousSize = previousSizeMap[removeFileNameHash( asset.name )];
      const difference = getDifferenceLabel( size, previousSize );
      return {
        folder: path.join( appBuild, path.dirname( asset.name )),
        name: path.basename( asset.name ),
        size,
        sizeLabel: filesize( size ) + ( difference ? ` (${difference})` : '' )
      };
    });
  assets.sort(( a, b ) => b.size - a.size );
  const longestSizeLabelLength = Math.max.apply(
    null,
    assets.map( a => stripAnsi( a.sizeLabel ).length ),
  );
  assets.forEach(( asset ) => {
    let sizeLabel = asset.sizeLabel;
    const sizeLength = stripAnsi( sizeLabel ).length;
    if ( sizeLength < longestSizeLabelLength ) {
      const rightPadding = ' '.repeat( longestSizeLabelLength - sizeLength );
      sizeLabel += rightPadding;
    }
    print(
      `  ${sizeLabel}  ${chalk.dim( asset.folder + path.sep )}${chalk.cyan( asset.name )}`,
    );
  });
}

// Print out errors
function printErrors( summary, errors ) {
  print( chalk.red( summary ));
  errors.forEach( err => print( err.message || err ));
}

function doneHandler( previousSizeMap, argv, resolve, err, stats ) {
  if ( err ) {
    printErrors( 'Failed to compile.', [err]);
    print();
    process.exit( 1 );
  }

  if ( stats.compilation.errors.length ) {
    printErrors( 'Failed to compile.', stats.compilation.errors );
    print();
    process.exit( 1 );
  }

  print( chalk.green( 'Compiled successfully.' ));
  print( 'File sizes after gzip:' );
  printFileSizes( stats, previousSizeMap );
  print();

  if ( argv.analyze ) {
    print( `Analyze result is generated at ${chalk.cyan( 'dist/stats.html' )}.` );
  }

  resolve();
}

// Create the production build and print the deployment instructions.
function realBuild( previousSizeMap, resolve, argv ) {
  print( 'Creating dll bundle...' );
  print();

  const compiler = webpack( config );
  const done = doneHandler.bind( null, previousSizeMap, argv, resolve );
  compiler.run( done );
}

// Run.
if ( require.main === module ) {
  build( argv );
}
