//@flow

import path from 'path';
import JSON5 from 'json5';
import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';
import mergeConfig from './mergeConfig';
import { CONFIG_FILES } from './paths';
import { printError } from './print';


export default function mergeConfig( ...configs: Array<Object> ): Object {

  
}
