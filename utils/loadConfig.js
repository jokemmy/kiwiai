// @flow

import { existsSync } from 'fs';

// 因为进程重启了所以可以用 require 加载，否则配置文件的修改后多次 require 无效
export default function loadConfig( pathToConfig: string ) {
  if ( existsSync( pathToConfig )) {
    return require( pathToConfig );
  }
  return {};
}
