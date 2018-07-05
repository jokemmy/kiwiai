#!/usr/bin/env node

'use strict';


process.on( 'unhandledRejection', err => {
  throw err;
});


const chalk = require( 'chalk' );
const spawn = require( 'cross-spawn' );
const args = process.argv.slice( 2 );
const scriptIndex = args.findIndex( x => {
  return x === 'build' || x === 'dev' || x === 'start' || x === 'test' ||
    x === 'server' || x === 'dll';
});
let script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice( 0, scriptIndex ) : [];

// dev alias server
if ( script === 'server' ) {
  script = 'dev';
}

switch ( script ) {
  case '-v':
  case '--version':
    console.log( require( '../package.json' ).version );
    break;
  case 'dev':
  case 'build':
  case 'test':
  case 'dll': {
    const result = spawn.sync(
      'node',
      nodeArgs
        .concat( require.resolve( '../script/' + script ))
        .concat( args.slice( scriptIndex + 1 )),
      { stdio: 'inherit' }
    );
    if ( result.signal ) {
      if ( result.signal === 'SIGKILL' ) {
        console.log(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
      } else if ( result.signal === 'SIGTERM' ) {
        console.log(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
      }
      process.exit( 1 );
    }
    process.exit( result.status );
    break;
  }
  default:
    if ( script ) {
      console.log( 'Unknown script "' + script + '".' );
      console.log( 'Perhaps you need to update kiwiai?' );
    } else {
      console.log( 'Do you mean ' + chalk.gray( 'kiwiai dev' ) + '?' );
      console.log( chalk.gray( 'Also you can try:' ));
      console.log( chalk.gray( 'kiwiai build' ));
      console.log( chalk.gray( 'kiwiai test' ));
      console.log( chalk.gray( 'kiwiai dll' ));
    }
    break;
}
