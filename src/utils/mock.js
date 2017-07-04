
import fs from 'fs';
import url from 'url';
import chalk from 'chalk';
import { join } from 'path';
import assert from 'assert';
import chokidar from 'chokidar';
import proxy from 'express-http-proxy';
import bodyParser from 'body-parser';
import paths from './paths';
import print from './print';
import is from './is';

let error = null;
let changedPath = '';

// get all files of mock
// 由于是不重启进程所以如果要多次 require 并保持最新的内容就必须要删除 require.cache 中的缓存
export function getConfig( resolvedFilePath ) {
  if ( fs.existsSync( resolvedFilePath )) {
    const files = [];
    const realRequire = require.extensions['.js'];
    require.extensions['.js'] = ( m, filename ) => {
      if ( filename.indexOf( paths.appNodeModules ) === -1 ) {
        files.push( filename );
      }
      return realRequire( m, filename );
    };
    if ( changedPath in require.cache ) {
      delete require.cache[changedPath];
    }
    const config = require( resolvedFilePath );  // eslint-disable-line
    require.extensions['.js'] = realRequire;
    changedPath = '';
    return { config, files };
  }
  return {
    config: {},
    files: [resolvedFilePath]
  };

}

function createMockHandler( _method, _path, value ) {
  return function mockHandler( ...args ) {
    const res = args[1];
    if ( typeof value === 'function' ) {
      value( ...args );
    } else {
      res.json( value );
    }
  };
}

function winPath( path ) {
  return path.replace( /\\/g, '/' );
}

function createProxy( method, path, target ) {
  return proxy( target, {
    filter( req ) {
      return method ? req.method.toLowerCase() === method.toLowerCase() : true;
    },
    forwardPath( req ) {
      let matchPath = req.baseUrl;
      const matches = matchPath.match( path );
      if ( matches.length > 1 ) {
        matchPath = matches[1];
      }
      return join( winPath( url.parse( target ).path ), matchPath );
    }
  });
}

function realApplyMock( devServer ) {
  const ret = getConfig( paths.appSeverMockConfig );
  const config = ret.config;
  const files = ret.files;
  const app = devServer.app;

  devServer.use( bodyParser.json({ limit: '5mb' }));
  devServer.use( bodyParser.urlencoded({
    extended: true,
    limit: '5mb'
  }));

  Object.keys( config ).forEach(( key ) => {
    const keyParsed = parseKey( key ); // eslint-disable-line
    assert(
      !!app[keyParsed.method],
      `method of ${key} is not valid`,
    );
    assert(
      is.Function( config[key]) ||
      is.PlainObject( config[key]) ||
      is.String( config[key]),
      `mock value of ${key} should be function or object or string, but got ${typeof config[key]}`,
    );
    if ( is.String( config[key])) {
      let path = keyParsed.path;
      if ( /\(.+\)/.test( keyParsed.path )) {
        path = new RegExp( `^${keyParsed.path}$` );
      }
      app.use(
        path,
        createProxy( keyParsed.method, path, config[key]),
      );
    } else {
      app[keyParsed.method](
        keyParsed.path,
        createMockHandler( keyParsed.method, keyParsed.path, config[key]),
      );
    }
  });

  // 调整 stack，把 historyApiFallback 放到最后
  let lastIndex = null;
  app._router.stack.forEach(( item, index ) => {
    if ( item.name === 'webpackDevMiddleware' ) {
      lastIndex = index;
    }
  });
  const mockAPILength = app._router.stack.length - 1 - lastIndex;
  if ( lastIndex && lastIndex > 0 ) {
    const newStack = app._router.stack;
    newStack.push( newStack[lastIndex - 1]);
    newStack.push( newStack[lastIndex]);
    newStack.splice( lastIndex - 1, 2 );
    app._router.stack = newStack;
  }

  const watcher = chokidar.watch( files, {
    ignored: /node_modules/,
    persistent: true
  });
  watcher.on( 'change', ( path ) => {
    changedPath = path;
    print( chalk.green( 'CHANGED' ), path.replace( paths.appDirectory, '.' ));
    watcher.close();

    // 删除旧的 mock api
    app._router.stack.splice( lastIndex - 1, mockAPILength );

    applyMock( devServer ); // eslint-disable-line
  });
}

function parseKey( key ) {
  let method = 'get';
  let path = key;

  if ( key.indexOf( ' ' ) > -1 ) {
    const splited = key.split( ' ' );
    method = splited[0].toLowerCase();
    path = splited[1];
  }

  return { method, path };
}

export function applyMock( devServer ) {
  const realRequire = require.extensions['.js'];
  try {
    realApplyMock( devServer );
    error = null;
  } catch ( e ) {
    // 避免 require mock 文件出错时 100% cpu
    require.extensions['.js'] = realRequire;

    error = e;

    print();
    outputError(); // eslint-disable-line

    const watcher = chokidar.watch( paths.appSeverMockConfig, {
      ignored: /node_modules/,
      persistent: true
    });
    watcher.on( 'change', ( path ) => {
      changedPath = path;
      print( chalk.green( 'CHANGED' ), path.replace( paths.appDirectory, '.' ));
      watcher.close();
      applyMock( devServer );
    });
  }
}


export function outputError() {
  if ( !error ) return;

  const filePath = error.message.split( ': ' )[0];
  const relativeFilePath = filePath.replace( paths.appDirectory, '.' );
  const errors = error.stack.split( '\n' )
    .filter( line => line.trim().indexOf( 'at ' ) !== 0 )
    .map( line => line.replace( `${filePath}: `, '' ));
  errors.splice( 1, 0, ['']);

  print( chalk.red( 'Failed to parse mock config.' ));
  print( `Error in ${relativeFilePath}`, errors.join( '\n' ));
}
