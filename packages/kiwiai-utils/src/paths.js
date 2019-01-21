//@flow

import { resolve } from 'path';
import { realpathSync } from 'fs';

// 当前运行目录
export const appDirectory = realpathSync( process.cwd());

// 配置文件目录
// 预设两个目录, 方便开发配置文件管理, 避免根目录下配置文件过多
// 从左到右优先加载
export const CONFIG_PATH: Array<string> = [ '', 'config' ].map(( dir ) => {
  return resolve( appDirectory, dir );
});

// 配置文件名称
// 推荐简易的JSON文件, 需要自定义时使用 js 文件
// 从左到右优先加载
export const CONFIG_FILES: Array<string> = CONFIG_PATH.map(( dir ) => {
  return [ '.kwarc', '.kiwiairc', '.kiwiairc.js' ]
    .map(( name ) => resolve( dir, name ));
}).reduce(( arr, item ) => arr.concat[item], []);


// const MOCK_CONFIG = 'kiwiai.mock.js';
// const DEV_CONFIG = 'webpack.config.dev.js';
// const DLL_CONFIG = 'webpack.config.dll.js';
// const PROD_CONFIG = 'webpack.config.prod.js';


// // 当前项目相对路径
// function resolveOwn( relativePath ) {
//   return resolve( __dirname, relativePath );
// }

export function resolveApp( relativePath: string ) {
  return resolve( appDirectory, relativePath );
}

// export default {
//   outputPath: 'dist',
//   SEVER_CONFIG,
//   SEVER_MOCK_CONFIG,
//   WEBPACK_DEV_CONFIG,
//   WEBPACK_DLL_CONFIG,
//   WEBPACK_PROD_CONFIG,
//   appSeverConfig: resolveApp( SEVER_CONFIG ),
//   appSeverMockConfig: resolveApp( SEVER_MOCK_CONFIG ),
//   appWebpackDevConfig: resolveApp( WEBPACK_DEV_CONFIG ),
//   appWebpackDllConfig: resolveApp( WEBPACK_DLL_CONFIG ),
//   appWebpackProdConfig: resolveApp( WEBPACK_PROD_CONFIG ),
//   appSrc: resolveApp( 'src' ),
//   appBuild: resolveApp( 'dist' ),
//   appPublic: resolveApp( 'public' ),
//   appIndex: resolveApp( 'src/index.js' ),
//   appFav: resolveApp( 'public/fav.ico' ),
//   appHtml: resolveApp( 'public/index.html' ),
//   appPackageJson: resolveApp( 'package.json' ),
//   appNodeModules: resolveApp( 'node_modules' ),
//   ownNodeModules: resolveServer( 'node_modules' ),
//   dllNodeModule: resolveApp( 'node_modules/.kiwiai-dlls' ),
//   dllFile: resolveApp( 'node_modules/.kiwiai-dlls/dlls.js' ),
//   dllManifest: resolveApp( 'node_modules/.kiwiai-dlls/dlls.json' ),
//   visualizerFile: './analyze/stats.html',
//   resolveApp,
//   resolveServer,
//   appDirectory
// };
