#!/usr/bin/env node

require( './registerBabel' );
const fork = require( 'child_process' ).fork;


function start() {
  const p = fork( `${__dirname}/server`, process.argv.slice( 2 ));
  p.on( 'message', ( data ) => {
    if ( data === 'RESTART' ) {
      p.kill( 'SIGINT' );
      start();
    }
  });
}

if ( !process.send ) {
  start();
} else {
  require( './runServer' );
}
