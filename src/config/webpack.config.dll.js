
import { join } from 'path';
import webpack from 'webpack';
// eslint-disable-next-line
import { paths } from 'kiwiai';


const appBuild = paths.dllNodeModule;
const pkg = require( join( paths.appDirectory, 'package.json' )); // eslint-disable-line
const dependencyNames = Object.keys( pkg.dependencies );

export default {
  entry: {
    dlls: dependencyNames
  },
  output: {
    path: appBuild,
    filename: '[name].dll.js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: join( appBuild, '[name].json' ),
      context: paths.appSrc,
      name: '[name]'
    })
  ],
  resolve: {
    modules: [
      paths.ownNodeModules,
      paths.appNodeModules
    ],
    extensions: [
      '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
      '.js', '.json', '.jsx', '.ts', '.tsx'
    ]
  }
};
