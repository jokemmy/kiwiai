
import { resolve } from 'path';
import { realpathSync } from 'fs';

function resolveOwn( relativePath ) {
  return resolve( __dirname, relativePath );
}

const appDirectory = realpathSync( process.cwd());
const serverDirectory = resolveOwn( '../../' );
const SEVER_CONFIG = 'kiwiai.config.js';
const WEBPACK_DEV_CONFIG = 'webpack.config.dev.js';
const WEBPACK_DLL_CONFIG = 'webpack.config.dll.js';
const WEBPACK_PROD_CONFIG = 'webpack.config.prod.js';

function resolveApp( relativePath ) {
  return relativePath && typeof relativePath === 'string'
    ? resolve( appDirectory, relativePath ) : '';
}

function resolveServer( relativePath ) {
  return relativePath && typeof relativePath === 'string'
    ? resolve( serverDirectory, relativePath ) : '';
}

export default {
  outputPath: 'dist',
  SEVER_CONFIG,
  WEBPACK_DEV_CONFIG,
  WEBPACK_DLL_CONFIG,
  WEBPACK_PROD_CONFIG,
  appSeverConfig: resolveApp( SEVER_CONFIG ),
  appWebpackDevConfig: resolveApp( WEBPACK_DEV_CONFIG ),
  appWebpackDllConfig: resolveApp( WEBPACK_DLL_CONFIG ),
  appWebpackProdConfig: resolveApp( WEBPACK_PROD_CONFIG ),
  appSrc: resolveApp( 'src' ),
  appBuild: resolveApp( 'dist' ),
  appPublic: resolveApp( 'public' ),
  appIndex: resolveApp( './src/index.js' ),
  appFav: resolveApp( './public/fav.ico' ),
  appHtml: resolveApp( './public/index.html' ),
  appPackageJson: resolveApp( 'package.json' ),
  appNodeModules: resolveApp( 'node_modules' ),
  ownNodeModules: resolveServer( 'node_modules' ),
  dllNodeModule: resolveApp( 'node_modules/.webpack-dlls' ),
  dllManifest: resolveApp( 'node_modules/.webpack-dlls/dlls.json' ),
  visualizerFile: './analyze/stats.html',
  resolveApp,
  resolveServer,
  appDirectory
};
