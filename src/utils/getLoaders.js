
import autoprefixer from 'autoprefixer';
import compose from './compose';


export function getDefaultLoaderOptions( picker ) {

  const defaultOptions = {
    url: {
      limit: 10000
    },
    file: {
      name: '[name].[ext]'
    },
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
    postcss: {
      plugins: () => [
        autoprefixer({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9' // React doesn't support IE8 anyway
          ]
        })
      ]
    }
  };

  if ( picker ) {
    return defaultOptions[picker];
  }
  return defaultOptions;
}


function loaderCreator( loaderName, defaultOptions = {}) {
  return compose(( options ) => {
    if ( Object.keys( options ).length || Object.keys( defaultOptions ).length ) {
      return {
        loader: loaderName,
        options: Object.assign({}, defaultOptions, options )
      };
    }
    return loaderName;
  }, ( ...opts ) => {
    if ( opts.length ) {
      return Object.assign({}, ...opts );
    }
    return {};
  });
}

export const styleLoader = loaderCreator( 'style-loader' );

export const cssLoader = loaderCreator( 'css-loader' );

export const postcssLoader = loaderCreator( 'postcss-loader', getDefaultLoaderOptions( 'postcss' ));

export const lessLoader = loaderCreator( 'less-loader' );

export const urlLoader = loaderCreator( 'url-loader', getDefaultLoaderOptions( 'url' ));

export const babelLoader = loaderCreator( 'babel-loader', getDefaultLoaderOptions( 'babel' ));

export const fileLoader = loaderCreator( 'file-loader', getDefaultLoaderOptions( 'file' ));

export const jsonLoader = loaderCreator( 'json-loader' );

export const typescriptLoader = loaderCreator( 'awesome-typescript-loader' );
