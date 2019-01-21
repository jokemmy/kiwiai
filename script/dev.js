#!/usr/bin/env node

require( 'kiwiai-utils/lib/babelRegister' );

'use strict';

process.on( 'unhandledRejection', err => {
  throw err;
});

// 项目开发环境变量
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// 参数
const args = process.argv.slice( 2 );
const { fork } = require( 'kiwiai-utils' );

// 用当前文件创建子进程
fork( __filename );

// 子进程逻辑
if ( process.send ) {
  if ( args.indexOf( '-ssr' ) === -1 ) {
    require( './devServer' )
  } else {
    require( './devServerSSR' )
  }
}
