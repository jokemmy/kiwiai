// @flow

import kwaDebug from 'debug';


export const debug = kwaDebug( 'KWA' );

export function exit( message?: string ) {
  if ( message ) {
    debug( message );
  }
  process.exit( 1 );
}

export function log( ...messages: Array<string> ): void {
  if ( messages.length > 0 ) {
    messages.forEach(( message ) => {
      debug( message );
    });
  } else {
    debug();
  }
}

export function error( error: string | Error ): void {
  let text = error;
  if ( error instanceof Error ) {
    text = error.stack || error.message;
  }
  debug( '' );
  debug( text );
  debug( '' );
}
