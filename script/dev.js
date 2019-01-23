#!/usr/bin/env node

require( 'kiwiai-utils/lib/babelRegister' );

'use strict';

process.on( 'unhandledRejection', err => {
  console.log("unhandledRejection");
  throw err;
});

// 项目开发环境变量
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// 参数
const args = process.argv.slice( 2 );
const { fork } = require( 'kiwiai-utils' );

// 子进程逻辑
// -ssr 启动服务端渲染开发逻辑
// 默认启动单页面程序开发逻辑
if ( process.send ) {
  if ( args.indexOf( '-ssr' ) === -1 ) {
    require( './devServer' )
  } else {
    require( './devServerSSR' )
  }
}

// 用当前文件创建子进程
else {
  fork( __filename );
}
