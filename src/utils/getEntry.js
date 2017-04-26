
import glob from 'glob';
import assert from 'assert';
import { basename, sep } from 'path';
import { appDirectory, appIndex } from './paths';

function getEntry( filePath ) {
  return { [basename( filePath, '.js' )]: filePath };
}

export function getFiles( entry, cwd ) {
  if ( Array.isArray( entry )) {
    return entry.reduce(( memo, entryItem ) => {
      return memo.concat( getFiles( entryItem, cwd ));
    }, []);
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

export function getEntries( files ) {
  return files.reduce(( memo, file ) => {
    return Object.assign( memo, getEntry( file ));
  }, {});
}

export default function( entry ) {
  const entries = getEntries( entry ? getFiles( entry, appDirectory ) : [appIndex]);
  if ( process.env.NODE_ENV === 'development' ) {
    entries.hmr = require.resolve( 'react-dev-utils/webpackHotDevClient' );
  }
  return entries;
}
