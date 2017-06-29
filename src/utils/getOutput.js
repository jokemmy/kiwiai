
import paths from './paths';

const publicPath = '/';

export default function( output = {}, cover = false ) {
  return cover ? output : Object.assign({
    publicPath,
    pathinfo: true,
    path: paths.appBuild,
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  }, output );
}
