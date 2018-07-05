
import { resolve } from 'path';
import { realpathSync } from 'fs';
import kwaOptions from './kwaOptions';


function resolveOwn( relativePath ) {
  return resolve( __dirname, relativePath );
}

const kwaDir = resolveOwn( '../' );
const appDir = realpathSync( process.cwd());
const isKwaDev = appDir === kwaDir;
const KIWIAI_MOCK = 'kiwiai.mock.js';
const KIWIAI_CONFIG = 'kiwiai.config.js';


function resolveApp( relativePath ) {
  return relativePath && typeof relativePath === 'string'
    ? resolve( appDir, relativePath ) : '';
}


function resolveKwa( relativePath ) {
  return relativePath && typeof relativePath === 'string'
    ? resolve( kwaDir, relativePath ) : '';
}


function condfigPath( relativePath ) {
  return isKwaDev
    ? resolveKwa( `./config/${relativePath}` )
    : resolveApp( relativePath );
}


const kwaConfig = kwaOptions( condfigPath( KIWIAI_CONFIG ));
const { webpackConfigs, outputPath } = kwaConfig;
const WEBPACK_DEV_CONFIG = webpackConfigs.development;
const WEBPACK_PROD_CONFIG = webpackConfigs.production;
const WEBPACK_DLL_CONFIG = webpackConfigs.dll;

// 没有配置的正确性验证以后补
const paths = {

  outputPath,
  // file name
  KIWIAI_MOCK,
  KIWIAI_CONFIG,
  WEBPACK_DEV_CONFIG,
  WEBPACK_DLL_CONFIG,
  WEBPACK_PROD_CONFIG,

  appKwaConfig: kwaConfig,

  // file path
  appKwaConfigFile: condfigPath( KIWIAI_CONFIG ),
  appKwaMockConfigFile: condfigPath( KIWIAI_MOCK ),
  appWebpackDevConfigFile: condfigPath( WEBPACK_DEV_CONFIG ),
  appWebpackDllConfigFile: condfigPath( WEBPACK_DLL_CONFIG ),
  appWebpackProdConfigFile: condfigPath( WEBPACK_PROD_CONFIG ),
  // 源码文件夹
  appSrc: resolveApp( 'src' ),
  // 编译生成文件夹
  appBuild: resolveApp( 'dist' ),
  // 拷贝文件夹
  appPublic: resolveApp( 'public' ),
  // 入口文件
  appIndex: resolveApp( 'src/index.js' ),
  // appFav: resolveApp( 'public/fav.ico' ),
  // appHtml: resolveApp( 'public/index.html' ),
  // pkg
  appPackageJson: resolveApp( 'package.json' ),
  // 开发包
  appNodeModules: resolveApp( 'node_modules' ),
  // kwa包
  ownNodeModules: resolveKwa( 'node_modules' ),
  // dll配置
  dllNodeModule: resolveApp( 'node_modules/.kwa-dll' ),
  dllFile: resolveApp( 'node_modules/.kwa-dll/dll.js' ),
  dllManifest: resolveApp( 'node_modules/.kwa-dll/manifest.json' ),
  // 打包分析结果
  visualizerFile: './analyze/stats.html',
  resolveApp,
  resolveKwa,
  appDir,
  kwaDir
};

export default paths;
