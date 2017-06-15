
// eslint-disable-next-line
import { paths, getEntry, getOutput, getSVGRules, loaders, plugins, combine } from 'kiwiai';


const { extractTextExtract } = plugins;
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
const output = {
  publicPath: '',
  filename: '[name].$[chunkhash:4].js',
  chunkFilename: '[name].$[chunkhash:4].chunk.js'
};
const lessTheme = {
  // modifyVars: theme
};
const svgRules = Object.values( getSVGRules({
  fileName: staticFileName,  // eslint-disable-line
  // svgSpriteDirs: [
  //   require.resolve( 'antd-mobile' ).replace( /warn\.js$/, '' ),
  //   paths.resolveApp( 'src/assets' )
  // ]
}));

// babel 的配置
const babelOptions = getDefaultLoaderOptions( 'babel' );
// presets
babelOptions.presets.push( 'react-native' );
// plugins
babelOptions.plugins.push( 'transform-runtime' );
babelOptions.plugins.push( 'transform-class-properties' );
babelOptions.plugins.push( 'transform-decorators-legacy' );


export default {
  bail: true,
  entry: getEntry([ './src/common.js', './src/index.js' ]),
  output: getOutput( output ),
  resolve: {
    modules: [
      paths.appSrc,
      paths.appNodeModules,
      paths.ownNodeModules
    ],
    extensions: [
      '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
      '.js', '.jsx', '.ts', '.tsx', '.json'
    ]
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
      use: [
        babelLoader( babelOptions ),
        typescriptLoader()
      ]
    }, {
      test: /\.css$/,
      include: paths.appSrc,
      use: extractTextExtract({
        fallback: styleLoader(),
        use: [
          cssLoader( cssOptions, cssModules ),
          postcssLoader()
        ]
      })
    }, {
      test: /\.less$/,
      include: paths.appSrc,
      use: extractTextExtract({
        fallback: styleLoader(),
        use: [
          cssLoader( cssOptions, cssModules ),
          postcssLoader(),
          lessLoader( lessTheme )
        ]
      })
    }, {
      test: /\.css$/,
      include: paths.appNodeModules,
      use: extractTextExtract({
        fallback: styleLoader(),
        use: [
          cssLoader( cssOptions ),
          postcssLoader()
        ]
      })
    }, {
      test: /\.less$/,
      include: paths.appNodeModules,
      use: extractTextExtract({
        fallback: styleLoader(),
        use: [
          cssLoader( cssOptions ),
          postcssLoader(),
          lessLoader( lessTheme )
        ]
      })
    }, {
      test: /\.json$/,
      use: [jsonLoader()]
    }]
    .concat( svgRules )
  },
  plugins: combine(
    plugins.Define(),
    plugins.CopyPublic(),
    plugins.UglifyJs(),
    plugins.Visualizer(),
    plugins.ExtractText( undefined, {
      filename: 'style.$[contenthash:4].css'
    }),
    plugins.HtmlWebpack(),
    plugins.CommonsChunk( undefined, {
      filename: 'common.$[chunkhash:4].js'
    })
  ),
  // externals: config.externals,
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
