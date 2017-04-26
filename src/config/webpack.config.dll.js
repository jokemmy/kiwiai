
import { join } from 'path';
import webpack from 'webpack';
import { paths } from 'kiwiai';

const appBuild = paths.dllNodeModule;
const pkg = require( join( paths.appDirectory, 'package.json' )); // eslint-disable-line
const dependencyNames = Object.keys( pkg.dependencies );
const includeDependencies = dependencyNames;

export default {
  entry: {
    dlls: includeDependencies
  },
  output: {
    path: appBuild,
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: join( appBuild, '[name].json' ),
      name: '[name]',
      context: paths.appSrc
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
