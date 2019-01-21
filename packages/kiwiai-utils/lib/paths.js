"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveApp = resolveApp;
exports.CONFIG_FILES = exports.CONFIG_PATH = exports.appDirectory = void 0;

var _path = require("path");

var _fs = require("fs");

// 当前运行目录
var appDirectory = (0, _fs.realpathSync)(process.cwd()); // 配置文件目录
// 预设两个目录, 方便开发配置文件管理, 避免根目录下配置文件过多
// 从左到右优先加载

exports.appDirectory = appDirectory;
var CONFIG_PATH = ['', 'config'].map(function (dir) {
  return (0, _path.resolve)(appDirectory, dir);
}); // 配置文件名称
// 推荐简易的JSON文件, 需要自定义时使用 js 文件
// 从左到右优先加载

exports.CONFIG_PATH = CONFIG_PATH;
var CONFIG_FILES = CONFIG_PATH.map(function (dir) {
  return ['.kwarc', '.kiwiairc', '.kiwiairc.js'].map(function (name) {
    return (0, _path.resolve)(dir, name);
  });
}).reduce(function (arr, item) {
  return arr.concat[item];
}, []); // const MOCK_CONFIG = 'kiwiai.mock.js';
// const DEV_CONFIG = 'webpack.config.dev.js';
// const DLL_CONFIG = 'webpack.config.dll.js';
// const PROD_CONFIG = 'webpack.config.prod.js';
// // 当前项目相对路径
// function resolveOwn( relativePath ) {
//   return resolve( __dirname, relativePath );
// }

exports.CONFIG_FILES = CONFIG_FILES;

function resolveApp(relativePath) {
  return (0, _path.resolve)(appDirectory, relativePath);
} // export default {
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