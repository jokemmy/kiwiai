
import assert from 'assert';
import { join } from 'path';
import webpack from 'webpack';
import { existsSync } from 'fs';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
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

function Define( define ) {
  return new webpack.DefinePlugin(
    Object.assign({
      'process.env': {
        NODE_ENV: JSON.stringify( process.env.NODE_ENV ),
      }
    }, normalizeDefine( define ))
  );
};

function LoaderOptions( options ) {
  return new webpack.LoaderOptionsPlugin({
    options: Object.assign({
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
        return [ autoprefixer({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9' // React doesn't support IE8 anyway
          ]
        })];
      }
    }, options )
  });
}

function HotModuleReplacement( options ) {
  return new webpack.HotModuleReplacementPlugin( options );
}

function CaseSensitivePaths( options ) {
  return new CaseSensitivePathsPlugin( options );
}

function WatchMissingNodeModules( options ) {
  return new WatchMissingNodeModulesPlugin( options || paths.appNodeModules );
}

function SystemBellWebpack() {
  return new SystemBellWebpackPlugin();
}

function ExtractText( options ) {
  return new ExtractTextPlugin(  options || {
    filename: '[name].[contenthash].css',
    disable: false,
    allChunks: true
  });
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

function CopyWebpack( arrays ) {
  return [
    new CopyWebpackPlugin( arrays )
  ];
}

function CommonsChunk( options, extends = {}) {
  return [
    new webpack.optimize.CommonsChunkPlugin( options || {
      name: 'common',
      filename: 'common.js'
    })
  ];
}

function HtmlWebpack( options, extends = {}) {

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
      minify:{
        removeComments: true,
        collapseWhitespace: true
      }
    }, extends ))
  ];
}

export function combine( ...plugins ) {
  return plugins.reduce(( pluginsArray, plugin ) => {
    if ( plugin && !Array.isArray( plugin )) {
      return pluginsArray.concat([ plugin ]);
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
  HtmlWebpack
};