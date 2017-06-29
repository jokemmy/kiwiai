
/* eslint-disable */
import { existsSync } from 'fs';
import './registerBabel';

export default function getConfig( pathToConfig ) {
  if ( existsSync( pathToConfig )) {
    return require( pathToConfig );
  }
  return {};
}
