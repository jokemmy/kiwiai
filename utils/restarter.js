// @flow

import { fork } from 'child_process';

// nodejs 调试参数 --inspect-brk 程序开始短点
//                --inspect


function start( path: string ) {
  // 获取参数从第二个字符串开始
  const argvs = process.argv.slice( 2 );
  const childProcess = fork( path, argvs );
  childProcess.on( 'message', ( data ) => {
    if ( data === 'RESTART' ) {
      childProcess.kill( 'SIGINT' );
      start( path );
    }
  });
}


export default function( path: string, callback: function ) {
  if ( !process.send ) {
    start( path );
  } else {
    callback();
  }
}
