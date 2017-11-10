

// import path from 'path';
// eslint-disable-next-line
import { paths, getEntry, getOutput, getSVGRules, loaders, plugins, combine } from './src';


const { styleLoader, cssLoader, postcssLoader, lessLoader, urlLoader,
  babelLoader, jsonLoader, typescriptLoader, getDefaultLoaderOptions } = loaders;

const staticFileName = 'static/[name].$[hash:4].[ext]';
const cssModules = {
  modules: true,
  localIdentName: '[local]_[sha512:hash:base64:5]'
};
const cssOptions = {
  importLoaders: 1
};
const lessTheme = {
  // modifyVars: theme
};

// 添加了 antd-mobile 的 svg 图标配置
const svgRules = Object.values( getSVGRules({
  fileName: staticFileName, // eslint-disable-line
  // svgSpriteDirs: [
  //   require.resolve( 'antd-mobile' ).replace( /warn\.js$/, '' ),
  //   paths.resolveApp( './src/assets' )
  // ]
}));

// babel 的配置
const babelOptions = getDefaultLoaderOptions( 'babel' );
// presets
// babelOptions.presets.push( 'react-native' );
// plugins
// babelOptions.plugins.push( 'dva-hmr' );
// babelOptions.plugins.push( 'transform-runtime' );
// babelOptions.plugins.push( 'transform-class-properties' );
// babelOptions.plugins.push( 'transform-decorators-legacy' );
// babelOptions.plugins.push([ 'transform-runtime', { polyfill: false }]);
// babelOptions.plugins.push([ 'import', { libraryName: 'antd-mobile', style: true }]);

// postcss 配置
// const postcssOption = getDefaultLoaderOptions( 'postcss' );
// postcssOption.plugins = postcssOption.plugins();
// postcssOption.plugins.push( pxtorem({ rootValue: 100, propWhiteList: []}));

export default {
  devtool: 'cheap-module-source-map',
  entry: getEntry(['./src/app.js']),
  output: getOutput(),
  resolve: {
    modules: [
      paths.appSrc,
      paths.appNodeModules,
      paths.ownNodeModules
    ],
    extensions: [
      '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
      '.js', '.jsx', '.ts', '.tsx', '.json'
    ], // eslint-disable-line
    // alias: {
    //   'react-native': 'react-native-web',
    //   'react-navigation': 'react-navigation/lib/react-navigation.js'
    // }
  },
  module: {
    noParse: [/moment.js/],
    rules: [{
      exclude: [
        /\.html$/,
        /\.jsx?$/,
        /\.(css|less)$/,
        /\.json$/,
        /\.svg$/,
        /\.tsx?$/
      ],
      use: [urlLoader({ name: staticFileName })]
    }, {
      test: /\.jsx?$/,
      include: paths.appSrc,
      use: [babelLoader( babelOptions )]
    }, {
      test: /\.tsx?$/,
      include: paths.appSrc,
      use: [ babelLoader( babelOptions ), typescriptLoader() ]
    }, {
      test: /\.css$/,
      include: paths.appSrc,
      use: [
        styleLoader(),
        cssLoader( cssOptions, cssModules ),
        postcssLoader()
      ]
    }, {
      test: /\.less$/,
      include: paths.appSrc,
      use: [
        styleLoader(),
        cssLoader( cssOptions, cssModules ),
        postcssLoader(),
        lessLoader( lessTheme )
      ]
    }, {
      test: /\.css$/,
      include: paths.appNodeModules,
      use: [
        styleLoader(),
        cssLoader( cssOptions ),
        postcssLoader()
      ]
    }, {
      test: /\.less$/,
      include: paths.appNodeModules,
      use: [
        styleLoader(),
        cssLoader( cssOptions ),
        postcssLoader(),
        lessLoader( lessTheme )
      ]
    }, {
      test: /\.json$/,
      use: [jsonLoader()]
    }]
    .concat( svgRules )
  },
  plugins: combine(
    plugins.Define(),
    plugins.HotModuleReplacement(),
    plugins.CaseSensitivePaths(),
    plugins.WatchMissingNodeModules(),
    plugins.SystemBellWebpack(),
    plugins.CopyPublic(),
    // plugins.DllReferencePlugin(),
    plugins.HtmlWebpack(),
    plugins.CommonsChunk()
  ),
  // externals: config.externals,
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
