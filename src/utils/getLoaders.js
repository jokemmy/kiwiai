
import omit from 'omit.js';

function loaderCreator( loaderName, defaultOptions = {}) {
  return function( opts = {}) {
    const { _shortName = loaderName } = opts;
    const options = _shortName ? omit( opts, ['_shortName']) : opts;
    if ( Object.keys( options ).length ) {
      return {
        loader: _shortName,
        options: Object.assign( defaultOptions, options )
      };
    }
    return {
      loader: _shortName
    };
  };
}

export const styleLoader = loaderCreator( 'style-loader' );

export const cssLoader = loaderCreator( 'css-loader', {
  importLoaders: 1
});

export const postcssLoader = loaderCreator( 'postcss-loader'/* , {
  plugins: function() {
    return [ autoprefixer({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9' // React doesn't support IE8 anyway
      ]
    })];
  }
}*/ );

export const lessLoader = loaderCreator( 'less-loader' );

export const urlLoader = loaderCreator( 'url-loader', {
  limit: 10000
});

export const babelLoader = loaderCreator( 'babel-loader'/* , {
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
}*/ );

export const fileLoader = loaderCreator( 'file-loader', {
  name: '[name].[ext]'
});

export const jsonLoader = loaderCreator( 'json-loader' );

export const typescriptLoader = loaderCreator( 'awesome-typescript-loader' );
