
/* eslint-disable */
export default function( ...messages ) {
  if ( messages.length > 0 ) {
    messages.forEach(( message ) => {
      console.log( message );
    });
  } else {
    console.log();
  }
}
