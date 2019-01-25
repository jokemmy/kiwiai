//@flow

import { log } from './print';


// 信息状态
export const DONE = 'DONE';
export const STARTING = 'STARTING';
export const RESTART = 'RESTART';


let processName = 'Child';
export function setProcessName( argvs: Array<string> ) {
  const argv = argvs.find(( argv ) => /^-name=/.test( argv )) || '';
  if ( argv ) {
    processName = argv.replace( /^-name=/, '' );
  } else {
    log( `Process name not found, use default name: ${processName}` );
  }
}


type ProcessData = { type: string };
export function send( data: ProcessData ) {
  const processSend = process.send;
  if ( processSend ) {
    log( `Process[${processName}]:send ${JSON.stringify( data )}` );
    processSend( data );
  }
}
