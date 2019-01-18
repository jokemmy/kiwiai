#!/usr/bin/env node

'use strict';

process.on( 'unhandledRejection', err => {
  throw err;
});

const chalk = require( 'chalk' );
const spawn = require( 'cross-spawn' );
const args = process.argv.slice( 2 );
const defaultScript = [ 'init', 'dev', 'start', 'build', 'test', 'dll' ];
const defaultArgs = [ '-ssr', '-dll', '-debug' ];
const scriptIndex = args.findIndex( x => defaultScript.includes( x ));
let script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice( 0, scriptIndex ) : [];


// dev 单页面程序开发服务器
//     -ssr 开发服务端渲染服务器
//     -dll 开发编译dll
// start 服务端渲染编译后启动生产服务端渲染服务器
// build 纯静态程序编译
// test 运行单元测试
// dll 单独编译dll

switch ( script ) {
  case '-v':
  case '--version':
    console.log( require( '../package.json' ).version );
    break;
  case 'dev':
  case 'start':
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
  default: {
    const isScript = script && script.indexOf( '-' ) !== 0;
    const execArgs = args.filter(( arg ) => defaultArgs.includes( arg )).join( ' ' );
    if ( isScript ) {
      const maybes = defaultScript.filter(
        ( key ) => key.indexOf( script ) > -1 || script.indexOf( key ) > -1
      );
      if ( maybes.length ) {
        console.log();
        console.log( 'Do you mean below ?' );
        maybes.forEach(( key ) => {
          console.log( chalk.yellow( `  kiwiai ${key} ${execArgs}` ));
        });
        console.log();
      } else {
        console.log();
        console.log( 'Unknown script "' + script + '".' );
        console.log( 'Perhaps you need to update kiwiai ?' );
        console.log();
      }
    } else {
      console.log();
      console.log( 'Unknown script.' );
      console.log();
      console.log( 'Do you mean ' + chalk.yellow( `kiwiai dev ${execArgs}` ) + ' ?' );
      console.log( 'Also you can try:' );
      console.log( chalk.yellow( `  kiwiai init` ));
      console.log( chalk.yellow( `  kiwiai start` ));
      console.log( chalk.yellow( `  kiwiai build` ));
      console.log( chalk.yellow( `  kiwiai test` ));
      console.log( chalk.yellow( `  kiwiai dll` ));
      console.log();
    }
    break;
  }
}
