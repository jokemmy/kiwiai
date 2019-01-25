#!/usr/bin/env node

'use strict';

process.on( 'unhandledRejection', err => {
  console.log("unhandledRejection");
  throw err;
});

// 项目开发环境变量
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'production';

// 参数
const args = process.argv.slice( 2 );
const { fork, babelRegister } = require( 'kiwiai-utils' );
const isSSR = args.indexOf( '-ssr' ) > -1;


// 子进程逻辑
// -ssr 启动服务端渲染开发逻辑
// 默认启动单页面程序开发逻辑
if ( process.send ) {

  // 语法转换
  babelRegister({
    extensions: ['.js']
  });

  require( isSSR ? './devServerSSR' : './devServer' );
}

// 用当前文件创建子进程
else {
  fork( isSSR ? 'DevServerSideRender' : 'DevServer',  __filename );
}
