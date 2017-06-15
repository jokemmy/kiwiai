
import glob from 'glob';
import assert from 'assert';
import { basename, sep } from 'path';
import { appDirectory, appIndex } from './paths';
import is from './is';


export function getFiles( entry, cwd ) {
  if ( Array.isArray( entry )) {
    return entry.reduce(( memo, entryItem ) => {
      return memo.concat( getFiles( entryItem, cwd ));
    }, []);
  } else if ( is.Object( entry )) {
    return Object.entries( entry ).reduce(( memo, [ key, value ]) => {
      memo[key] = getFiles( value );
      return memo;
    }, {});
  }
  assert(
    typeof entry === 'string',
    `getEntry/getFiles: entry type should be string, but got ${typeof entry}`,
  );
  const files = glob.sync( entry, { cwd });
  return files.map(( file ) => {
    return ( file.charAt( 0 ) === '.' ) ? file : `.${sep}${file}`;
  });
}

function getEntry( filePath ) {
  if ( is.String( filePath )) {
    return { [basename( filePath ).replace( /\.(jsx?|tsx?)/, '' )]: filePath };
  }
  return filePath;
}

export function getEntries( files ) {
  if ( Array.isArray( files )) {
    return files.reduce(( memo, file ) => {
      return Object.assign( memo, getEntry( file ));
    }, {});
  }
  return files;
}

export default function( entry ) {
  const entries = getEntries( entry ? getFiles( entry, appDirectory ) : [appIndex]);
  if ( process.env.NODE_ENV === 'development' ) {
    entries.hmr = require.resolve( 'react-dev-utils/webpackHotDevClient' );
  }
  return entries;
}
