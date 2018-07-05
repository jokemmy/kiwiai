
import is from 'whatitis';
import chalk from 'chalk';
import pick from 'lodash.pick';
import print from './print';
import loadConfig from './loadConfig';
import defaultConfig from '../config/kiwiai.config.default';


const check = function( checker, value, path ) {
  if ( typeof value !== 'undefined' && !checker( value )) {
    print();
    print( chalk.red( `Type error occurred in [${path}].` ));
    print();
    throw new Error( 'TYPE_ERROR' );
  }
};

const validate = function( typed, origin, name = 'config' ) {
  const keys = Object.keys( typed );
  const picked = pick( origin, keys );
  for ( let i = 0, l = keys.length; i < l; i++ ) {
    const key = keys[i];
    if ( is.Object( typed[key]) && is.PlainObject( picked[key])) {
      validate( typed[key], picked[key], key );
    } else if ( typeof picked[key] !== 'undefined' ) {
      check( typed[key], picked[key], `${name}.${key}` );
    }
  }
};

// const arrayOf = function( checker ) {
//   return function( origin, name = 'config' ) {
//     origin.forEach(( value, index ) => {
//       check( checker, value, `${name}[${index}]` );
//     });
//     return true;
//   };
// };

const tranform = function( typed, config, defaultConfig = {}) {
  const keys = Object.keys( typed );
  const picked = pick( config, keys );
  for ( let i = 0, l = keys.length; i < l; i++ ) {
    const key = keys[i];
    if ( is.Object( typed[key])) {
      if ( is.PlainObject( picked[key])) {
        picked[key] = tranform( typed[key], picked[key], defaultConfig[key]);
      } else {
        Reflect.deleteProperty( picked, key );
      }
    } else if ( typeof picked[key] === 'undefined' && defaultConfig[key]) {
      picked[key] = defaultConfig[key];
    }
  }
  return picked;
};

const typed = {
  port: is.Number,
  proxy: is.Object,
  outputPath: is.String,
  webpackConfigs: {
    development: is.String,
    production: is.String,
    dll: is.String
  }
};

export default function( filePath ) {
  try {
    const config = loadConfig( filePath );
    validate( typed, config );
    return tranform( typed, config, defaultConfig );
  } catch ( err ) {
    if ( err.message !== 'TYPE_ERROR' ) {
      print();
      print( chalk.red( `Failed to read [${filePath}].` ));
      print();
      print( err.toString());
      print();
    }
    process.exit( 1 );
  }
}
