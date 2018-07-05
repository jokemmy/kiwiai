
import { fork } from 'child_process';


function start( file ) {
  const p = fork( file, process.argv.slice( 2 ));
  p.on( 'message', ( data ) => {
    if ( data === 'RESTART' ) {
      p.kill( 'SIGINT' );
      start( file );
    }
  });
}


export default function( file, runFn ) {
  if ( !process.send ) {
    start( file );
  } else {
    runFn();
  }
}
