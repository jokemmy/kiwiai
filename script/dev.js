#!/usr/bin/env node

require( '../utils/babelRegister' );

'use strict';

process.on( 'unhandledRejection', err => {
  throw err;
});

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const args = process.argv.slice( 2 );
const forever = require( '../utils/forever' );

// 进程自重启
forever( __filename, function() {
  // 主逻辑只运行一次
  if ( args.indexOf( '-ssr' ) === -1 ) {
    require( './runServer' )( require( './devServer' ));
  } else {
    require( './runServer' )( require( './devServerSSR' ));
  }
});
