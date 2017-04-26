
import { existsSync } from 'fs';

export default function getConfig( pathToConfig ) {
  if ( existsSync( pathToConfig ) ) {
    return require( pathToConfig );  // eslint-disable-line
  }
  return {};
}
