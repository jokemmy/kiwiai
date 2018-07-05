
import is from 'whatitis';
import chalk from 'chalk';
import assert from 'assert';
import { existsSync } from 'fs';
import detect from 'detect-port';
import flatten from 'lodash.flattendeep';
import paths from '../utils/paths';
import print from '../utils/print';
import loadConfig from '../utils/loadConfig';


const DEFAULT_PORT = 8000;

const {
  WEBPACK_DEV_CONFIG,
  appKwaConfig,
  appKwaConfigFile,
  appWebpackDevConfigFile } = paths;

const watchFiles = [ appKwaConfigFile, appWebpackDevConfigFile ];

const profile = {
  watchFiles,                          // 配置文件发生变化就自动重启服务
  isInteractive: process.stdout.isTTY  // 控制台程序
};


// 加载 webpack 配置
function readWebpackConfig() {

  try {

    assert(
      existsSync( appWebpackDevConfigFile ),
      `File ${WEBPACK_DEV_CONFIG} is not exsit.`
    );

    const wpConfig = loadConfig( appWebpackDevConfigFile );

    // 加载插件， 插件函数可能要修改配置
    if ( is.Function( wpConfig.plugins )) {
      wpConfig.plugins = wpConfig.plugins( wpConfig );
    }

    // 必须是个数组
    if ( !is.Array( wpConfig.plugins )) {
      wpConfig.plugins = [wpConfig.plugins];
    }

    // 多层函数扁平化，可能是多个生成插件的函数组合可能会形成嵌套数组，所以要扁平化
    wpConfig.plugins = flatten( wpConfig.plugins.map(( plugin ) => {
      return is.Function( plugin ) ? plugin( wpConfig ) : plugin;
    }));

    return wpConfig;
  } catch ( err ) {
    print();
    print( chalk.red( `Failed to read [${WEBPACK_DEV_CONFIG}].` ));
    print();
    print( err.toString());
    print();
    throw err;
  }
}

// 检测端口是否被占用
function portChecker( port, callback ) {
  return detect( port || DEFAULT_PORT ).then(( port_ ) => {
    if ( port_ !== port ) {
      print();
      print( chalk.yellow( `Something is already running on port ${port}.` ));
      print();
    } else {
      callback();
    }
  }).catch(() => {
    process.exit( 1 );
  });
}

export default ( server ) => {

  // 1. 检查端口
  // 2. 加载 webpack 配置
  // 3. 运行相应的服务器程序
  portChecker( appKwaConfig.port, () => {
    const webpackDevConfig = readWebpackConfig();
    server( Object.assign( appKwaConfig, profile, { webpackDevConfig }));
  });
};

