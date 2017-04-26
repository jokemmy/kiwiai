
import { resolve } from 'path';
import { realpathSync } from 'fs';

function resolveOwn ( relativePath ) {
  return resolve( __dirname, relativePath );
}

const appDirectory = realpathSync( process.cwd() );
const serverDirectory = resolveOwn( '../../' );

function resolveApp ( relativePath ) {
  return relativePath && typeof relativePath === 'string'
    ? resolve( appDirectory, relativePath ) : '';
}

function resolveServer ( relativePath ) {
  return relativePath && typeof relativePath === 'string'
    ? resolve( serverDirectory, relativePath ) : '';
}

export default {
  appSrc: resolveApp( 'src' ),
  appBuild: resolveApp( 'dist' ),
  appPublic: resolveApp( 'public' ),
  appPackageJson: resolveApp( 'package.json' ),
  appNodeModules: resolveApp( 'node_modules' ),
  ownNodeModules: resolveServer( 'node_modules' ),
  dllNodeModule: resolveApp( 'node_modules/webpack-dlls' ),
  dllManifest: resolveApp( 'node_modules/webpack-dlls/dlls.json' ),
  resolveApp,
  resolveServer,
  appDirectory,
};
