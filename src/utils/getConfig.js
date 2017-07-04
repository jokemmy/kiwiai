
/* eslint-disable */
import { existsSync } from 'fs';
import './registerBabel';

// 因为进程重启了所以可以用 require 加载，否则配置文件的修改后多次 require 无效
export default function getConfig( pathToConfig ) {
  if ( existsSync( pathToConfig )) {
    return require( pathToConfig );
  }
  return {};
}
