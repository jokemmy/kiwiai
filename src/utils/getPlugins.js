
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
  return [].concat(
    existsSync( paths.dllManifest ) ? [
      new webpack.DllReferencePlugin({
        context: paths.appSrc,
        manifest: require( paths.dllManifest )  // eslint-disable-line
      })
    ] : []
  ).concat(
    existsSync( join( paths.dllNodeModule, 'dlls.js' )) ? [
      new CopyWebpackPlugin( [{
        from: join( paths.dllNodeModule, 'dlls.js' ),
        to: join( paths.appBuild, 'dlls.js' )
      }])
    ] : []
  );
}

function CopyPublic() {
  return existsSync( paths.appPublic ) ? [
    new CopyWebpackPlugin([{
      from: paths.appPublic,
      to: paths.appBuild
    }])
  ] : [];
}

function CommonsChunk( options ) {
  return [
    new webpack.optimize.CommonsChunkPlugin( options || {
      name: 'common',
      filename: 'common.js'
    })
  ];
}

function HtmlWebpack( options ) {
  return [
    new HtmlWebpackPlugin( options || {
      // favicon: './src/logo/logo.ico',
      template: './src/index.html',
      filename: 'index.html',
      inject: true,
      minify:{    //压缩HTML文件
        removeComments: true,    //移除HTML中的注释
        collapseWhitespace: true    //删除空白符与换行符
      }

      // 方便实施人员修改配置 index.html 不压缩
      // minify: {  //压缩HTML文件
      //   removeComments: false,  //移除HTML中的注释
      //   collapseWhitespace: false  //删除空白符与换行符
      // }
    })
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
  CommonsChunk,
  HtmlWebpack
};