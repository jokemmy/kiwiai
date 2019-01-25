//@flow

import Tfork from './fork';
import { debug as Tdebug } from './print';
import Tcompose from './compose';
import TgetConfig from './getConfig';
import TbabelRegister from './babelRegister';


export const fork: typeof Tfork = Tfork;
export const debug: typeof Tdebug = Tdebug;
export const compose: typeof Tcompose = Tcompose;
export const getConfig: typeof TgetConfig = TgetConfig;
export const babelRegister: typeof TbabelRegister = TbabelRegister;
