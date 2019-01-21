//@flow

import chalk from 'chalk';
import assert from 'assert';
import { existsSync } from 'fs';
import { CONFIG_FILES } from './paths';


export function getOption(): Object {

  // 找到文件
  const configFilePath = CONFIG_FILES.find( existsSync );

  // 没有配置文件报错
  assert(
    !!configFilePath,
    chalk.green( 'Insufficient number of arguments or no entry found.' )
  );

  // 读取文件
  

}
