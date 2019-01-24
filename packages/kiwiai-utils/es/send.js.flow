//@flow

import debug from 'debug';

const kwaDebug = debug( 'kiwiai:send' );

// 信息状态
export const DONE = 'DONE';
export const STARTING = 'STARTING';
export const RESTART = 'RESTART';

export default function send( message: string ) {
  const posSend = process.send;
  if ( posSend ) {
    kwaDebug( `send ${JSON.stringify( message )}` );
    posSend( message );
  }
}
