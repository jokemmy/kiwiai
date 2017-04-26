
import autoprefixer from 'autoprefixer';

export const babel = {
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
};

export const postcss = function() {
  return [
    autoprefixer({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9' // React doesn't support IE8 anyway
      ]
    })
  ];
};
