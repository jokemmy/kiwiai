
import chalk from 'chalk';
import assert from 'assert';
import { join } from 'path';
import webpack from 'webpack';
import pick from 'object.pick';
import { existsSync } from 'fs';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import VisualizerPlugin from 'webpack-visualizer-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import SystemBellWebpackPlugin from 'system-bell-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import paths from './paths';

function normalizeDefine( define = {}) {
  return Object.keys( define ).reduce(( memo, key ) => {
    memo[key] = JSON.stringify( define[key]);
    return memo;
  }, {});
}

function Define( define, extendProps = {}) {
  return new webpack.DefinePlugin(
    Object.assign({
      'process.env': {
        NODE_ENV: JSON.stringify( process.env.NODE_ENV )
      }
    }, normalizeDefine( define || extendProps ))
  );
}

function getDefaultLoaderOptions( filter ) {

  const defaultOptions = {
    babel: {
      babelrc: false,
      presets: [
        require.resolve( 'babel-preset-es2015' ),
        require.resolve( 'babel-preset-react' ),
        require.resolve( 'babel-preset-stage-0' )
      ],
      plugins: [
        require.resolve( 'babel-plugin-add-module-exports' ),
        require.resolve( 'babel-plugin-react-require' )
      ],
      cacheDirectory: true
    },
    postcss() {
      return [autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9' // React doesn't support IE8 anyway
        ]
      })];
    }
  };

  return filter ? pick( defaultOptions, filter ) : defaultOptions;
}

function LoaderOptions( options = {}, extendOptions = {}) {
  return new webpack.LoaderOptionsPlugin( Object.assign({
    options: Object.assign( getDefaultLoaderOptions(), extendOptions )
  }, options ));
}

function HotModuleReplacement( options, extendProps = {}) {
  return new webpack.HotModuleReplacementPlugin( options || extendProps );
}

function CaseSensitivePaths( options, extendProps = {}) {
  return new CaseSensitivePathsPlugin( options || extendProps );
}

function WatchMissingNodeModules( nodeModulesPath ) {
  return new WatchMissingNodeModulesPlugin( nodeModulesPath || paths.appNodeModules );
}

function SystemBellWebpack() {
  return new SystemBellWebpackPlugin();
}

function ExtractText( options, extendProps = {}) {
  return new ExtractTextPlugin( options || Object.assign({
    filename: 'style.[contenthash].css',
    disable: false,
    allChunks: true
  }, extendProps ));
}

function extractTextExtract( options, extendProps = {}) {
  return ExtractTextPlugin.extract( options || extendProps );
}

function DllPlugins() {

  assert(
    existsSync( paths.dllManifest ) &&
    existsSync( join( paths.dllNodeModule, 'dlls.js' )),
    `File dlls.js is not exsit, please use ${chalk.cyan( 'npm run dll' )} first.`
  );

  return [
    new webpack.DllReferencePlugin({
      context: paths.appSrc,
      manifest: require( paths.dllManifest )  // eslint-disable-line
    }),
    new CopyWebpackPlugin([{
      from: join( paths.dllNodeModule, 'dlls.js' ),
      to: join( paths.appBuild, 'dlls.js' )
    }])
  ];
}

function CopyPublic() {
  return existsSync( paths.appPublic ) ? [
    new CopyWebpackPlugin([{
      from: paths.appPublic,
      to: paths.appBuild
    }])
  ] : [];
}

function CopyWebpack( arrays, extendArrayss = []) {
  return [
    new CopyWebpackPlugin( arrays || extendArrayss )
  ];
}

function CommonsChunk( options, extendProps = {}) {
  return [
    new webpack.optimize.CommonsChunkPlugin( options || Object.assign({
      name: 'common',
      filename: 'common.js'
    }, extendProps ))
  ];
}

function HtmlWebpack( options, extendProps = {}) {

  if (
    process.env.NODE_ENV === 'development' &&
    options && Array.isArray( options.chunks ) && options.chunks.length
  ) {
    options.chunks.unshift( 'hmr' );
  }

  return [
    new HtmlWebpackPlugin( options || Object.assign({
      favicon: paths.appFav,
      filename: 'index.html',
      template: paths.appHtml,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }, extendProps ))
  ];
}

function UglifyJs( options, extendProps = {}) {
  return [
    new webpack.optimize.UglifyJsPlugin( options || Object.assign({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true,
        ascii_only: true
      }
    }, extendProps ))
  ];
}

function Visualizer( options, extendProps = {}) {
  return [
    new VisualizerPlugin( options || Object.assign({
      filename: paths.visualizerFile
    }, extendProps ))
  ];
}

export function combine( ...plugins ) {
  return plugins.reduce(( pluginsArray, plugin ) => {
    if ( plugin && !Array.isArray( plugin )) {
      return pluginsArray.concat([plugin]);
    } else if ( Array.isArray( plugin ) && plugin.length ) {
      return pluginsArray.concat( plugin );
    }
    return pluginsArray;
  }, []);
}

export default {
  Define,
  LoaderOptions,
  HotModuleReplacement,
  CaseSensitivePaths,
  WatchMissingNodeModules,
  SystemBellWebpack,
  ExtractText,
  DllPlugins,
  CopyPublic,
  CopyWebpack,
  CommonsChunk,
  HtmlWebpack,
  UglifyJs,
  Visualizer,
  getDefaultLoaderOptions,
  extractTextExtract
};
