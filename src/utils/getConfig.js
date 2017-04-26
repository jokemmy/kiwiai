
import { existsSync } from 'fs';

require( './registerBabel' ); // eslint-disable-line

export default function getConfig( pathToConfig ) {
  if ( existsSync( pathToConfig )) {
    return require( pathToConfig );  // eslint-disable-line
  }
  return {};
}
