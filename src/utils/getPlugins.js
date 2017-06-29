
import chalk from 'chalk';
import assert from 'assert';
import webpack from 'webpack';
import { existsSync } from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import VisualizerPlugin from 'webpack-visualizer-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
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

function Define( options = {}, cover = false ) {
  return (
    new webpack.DefinePlugin( cover ? options : Object.assign({
      'process.env': {
        NODE_ENV: JSON.stringify( process.env.NODE_ENV )
      }
    }, normalizeDefine( options )))
  );
}

function HotModuleReplacement( options = {}) {
  return new webpack.HotModuleReplacementPlugin( options );
}

function CaseSensitivePaths( options = {}) {
  return new CaseSensitivePathsPlugin( options );
}

function WatchMissingNodeModules( nodeModulesPath ) {
  return new WatchMissingNodeModulesPlugin( nodeModulesPath || paths.appNodeModules );
}

function SystemBellWebpack() {
  return new SystemBellWebpackPlugin();
}

function ExtractText( options = {}, cover = false ) {
  return (
    new ExtractTextPlugin( cover ? options : Object.assign({
      filename: 'style.$[contenthash:4].css',
      disable: false,
      allChunks: true
    }, options ))
  );
}

function extractTextExtract( options = {}) {
  return ExtractTextPlugin.extract( options );
}

function DllReferencePlugin( options = {}, cover = false ) {

  assert(
    existsSync( paths.dllManifest ) && existsSync( paths.dllFile ),
    `File dlls.js is not exsit, please use ${chalk.cyan( 'npm run dll' )} first.`
  );

  return [
    new webpack.DllReferencePlugin( cover ? options : Object.assign({
      context: paths.appSrc,
      manifest: require( paths.dllManifest )  // eslint-disable-line
    }, options )),
    // add dlls.js to html
    new AddAssetHtmlPlugin({
      filepath: paths.dllFile,
      includeSourcemap: false
    })
  ];
}

function DllPlugin( options = {}, cover = false ) {
  return ({ output }) => {
    return (
      new webpack.DllPlugin( cover ? options : Object.assign({
        path: paths.dllManifest,
        context: paths.appSrc,
        name: output.library
      }, options ))
    );
  };
}

function CopyPublic() {
  return existsSync( paths.appPublic ) ? (
    new CopyWebpackPlugin([{
      from: paths.appPublic,
      to: paths.appBuild
    }])
  ) : [];
}

function CopyWebpack( arrays = []) {
  return (
    new CopyWebpackPlugin( arrays )
  );
}

function CommonsChunk( options = {}, cover = false ) {
  return (
    new webpack.optimize.CommonsChunkPlugin( cover ? options : Object.assign({
      name: 'vendor',
      filename: 'vendor.js'
    }, options ))
  );
}

function HtmlWebpack( options = {}, cover = false ) {

  return ({ entry }) => {

    const chunks = Object.keys( entry );

    // 热更新
    if (
      chunks.includes( 'hmr' ) &&
      options &&
      Array.isArray( options.chunks ) &&
      !options.chunks.includes( 'hmr' )
    ) {
      options.chunks.push( 'hmr' );
    }

    return (
      new HtmlWebpackPlugin( cover ? options : Object.assign({
        favicon: paths.appFav,
        filename: 'index.html',
        template: paths.appHtml,
        inject: true,
        chunksSortMode( chunk1, chunk2 ) {
          const chunk1Index = chunks.indexOf( chunk1.names[0]);
          const chunk2Index = chunks.indexOf( chunk2.names[0]);
          return chunk1Index - chunk2Index;
        },
        minify: {
          removeComments: true,
          collapseWhitespace: true
        }
      }, options ))
    );
  };
}

function UglifyJs( options = {}, cover = false ) {
  return (
    new webpack.optimize.UglifyJsPlugin( cover ? options : Object.assign({
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
    }, options ))
  );
}

function Visualizer( options = {}, cover = false ) {
  return (
    new VisualizerPlugin( cover ? options : Object.assign({
      filename: paths.visualizerFile
    }, options ))
  );
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
  HotModuleReplacement,
  CaseSensitivePaths,
  WatchMissingNodeModules,
  SystemBellWebpack,
  ExtractText,
  DllPlugin,
  DllReferencePlugin,
  CopyPublic,
  CopyWebpack,
  CommonsChunk,
  HtmlWebpack,
  UglifyJs,
  Visualizer,
  extractTextExtract
};
