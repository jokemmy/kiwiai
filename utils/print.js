// @flow

export default function( ...messages: Array<string> ): void {
  if ( messages.length > 0 ) {
    messages.forEach(( message ) => {
      console.log( message );
    });
  } else {
    console.log();
  }
}
