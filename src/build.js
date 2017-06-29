
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import assert from 'assert';
import webpack from 'webpack';
import filesize from 'filesize';
import stripAnsi from 'strip-ansi';
import flatten from 'arr-flatten';
import recursive from 'recursive-readdir';
import { sync as gzipSize } from 'gzip-size';
import is from './utils/is';
import print from './utils/print';
import paths from './utils/paths';
import getConfig from './utils/getConfig';

process.env.NODE_ENV = 'production';

const argv = require( 'yargs' ) // eslint-disable-line
  .usage( 'Usage: kiwiai build [options]' )
  .option( 'watch', {
    type: 'boolean',
    alias: 'w',
    describe: 'Watch file changes and rebuild',
    default: false
  })
  .option( 'output-path', {
    type: 'string',
    alias: 'o',
    describe: 'Specify output path',
    default: null
  })
  .help( 'h' )
  .argv;

let rcConfig;
let outputPath;
let appBuild;
let config;
let prodConfig;

function readConfig( pathToFile, fileName ) {
  try {
    return getConfig( pathToFile );
  } catch ( e ) {
    print(
      chalk.red( `Failed to read ${fileName}.` ),
      e.message
    );
    return '';
  }
}

export function build( argv ) { // eslint-disable-line

  rcConfig = readConfig( paths.appSeverConfig, paths.SEVER_CONFIG );
  outputPath = argv.outputPath || rcConfig.outputPath || paths.outputPath;
  appBuild = paths.resolveApp( outputPath );
  prodConfig = ( rcConfig.webpackConfig && rcConfig.webpackConfig.prod ) || paths.WEBPACK_PROD_CONFIG;
  config = readConfig( paths.resolveApp( prodConfig ), prodConfig );

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
        folder: path.join( outputPath, path.dirname( asset.name )),
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
    console.log(
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
    process.exit( 1 );
  }

  if ( stats.compilation.errors.length ) {
    printErrors( 'Failed to compile.', stats.compilation.errors );
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
  if ( argv.debug ) {
    console.log( 'Creating an development build without compress...' );
  } else {
    console.log( 'Creating an optimized production build...' );
  }

  const compiler = webpack( config );
  const done = doneHandler.bind( null, previousSizeMap, argv, resolve );
  if ( argv.watch ) {
    compiler.watch( 200, done );
  } else {
    compiler.run( done );
  }
}

// Run.
if ( require.main === module ) {
  build( argv );
}
