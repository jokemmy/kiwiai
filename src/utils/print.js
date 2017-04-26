
export default function( ...messages ) {
  console.log(); // eslint-disable-line
  messages.forEach(( message ) => {
    console.log( message ); // eslint-disable-line
    console.log(); // eslint-disable-line
  });
}
