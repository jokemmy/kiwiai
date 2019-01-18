
import debug from 'debug';

const kwaDebug = debug( 'kiwiai:send' );

// 信息状态
export const DONE = 'DONE';
export const STARTING = 'STARTING';
export const RESTART = 'RESTART';

export default function send( message ) {
  if ( process.send ) {
    kwaDebug( `send ${JSON.stringify( message )}` );
    process.send( message );
  }
}
