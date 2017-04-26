
// import theme from './';
import paths from '../utils/paths';
import getEntry from '../utils/getEntry';
import getOutput from '../utils/getOutput';
import getSVGRules from '../utils/getSVGRules';
import getFontRules from '../utils/getFontRules';
import plugins, { combine } from '../utils/getPlugins';
import { styleLoader, cssLoader, postcssLoader, lessLoader, urlLoader,
  babelLoader, fileLoader, jsonLoader, typescriptLoader } from '../utils/getLoaders';


// import { join } from 'path';
// import getPaths from './paths';
// import getEntry from '../utils/getEntry';
// import getTheme from '../utils/getTheme';
// import getCSSLoaders from '../utils/getCSSLoaders';
// import normalizeDefine from '../utils/normalizeDefine';
// import addExtraBabelIncludes from '../utils/addExtraBabelIncludes';


const publicPath = '/';
const staticFileName = 'static/[name].[ext]';
const cssModules = {
  modules: true,
  localIdentName: '[local]_[sha512:hash:base64:5]'
};
const lessTheme = {
  // modifyVar: JSON.stringify( theme )
};
const svgRules = Object.values( getSVGRules({
  fileName: staticFileName,
  // svgSpriteDirs: [
  //   require.resolve( 'antd-mobile' ).replace( /warn\.js$/, '' ),
  //   paths.resolveApp( 'src/assets/svg' )
  // ]
}));
const fontRules = Object.values( getFontRules({
  fileName: staticFileName
}));
console.log(paths)

export default {
  devtool: 'cheap-module-source-map',
  entry: getEntry([ './src/index.js' ]),
  output: getOutput(),
  resolve: {
    modules: [
      paths.ownNodeModules,
      paths.appNodeModules
    ],
    extensions: [
      '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
      '.js', '.json', '.jsx', '.ts', '.tsx'
    ]
  },
  module: {
    noParse: [/moment.js/],
    rules: [ {
      exclude: [
        /\.html$/,
        /\.(js|jsx)$/,
        /\.(css|less)$/,
        /\.json$/,
        /\.svg$/,
        /\.tsx?$/
      ],
      use: [urlLoader({ name: staticFileName })]
    }, {
      test: /\.(js|jsx)$/,
      include: paths.appSrc,
      use: [babelLoader()]
    }, {
      test: /\.tsx?$/,
      include: paths.appSrc,
      use: [ babelLoader(), typescriptLoader()]
    }, {
      test: /\.css$/,
      include: paths.appSrc,
      use: [ styleLoader(), cssLoader( cssModules ), postcssLoader()]
    }, {
      test: /\.less$/,
      include: paths.appSrc,
      use: [
        styleLoader(),
        cssLoader( cssModules ),
        postcssLoader(),
        lessLoader( lessTheme )
      ]
    }, {
      test: /\.css$/,
      include: paths.appNodeModules,
      use: [ styleLoader(), cssLoader(), postcssLoader()]
    }, {
      test: /\.less$/,
      include: paths.appNodeModules,
      use: [
        styleLoader(),
        cssLoader(),
        postcssLoader(),
        lessLoader( lessTheme )
      ]
    }/*, {
      test: /\.html$/,
      use: [fileLoader()]
    }*/, {
      test: /\.json$/,
      use: [jsonLoader()]
    }]
    .concat( svgRules )
    .concat( fontRules )
  },
  plugins: combine(
    plugins.Define(),
    plugins.LoaderOptions(),
    plugins.HotModuleReplacement(),
    plugins.CaseSensitivePaths(),
    plugins.WatchMissingNodeModules(),
    plugins.SystemBellWebpack(),
    // plugins.ExtractText(),
    plugins.DllPlugins(),
    plugins.CopyPublic(),
    plugins.HtmlWebpack(),
    // plugins.CommonsChunk()
  ),
  // externals: config.externals,
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
