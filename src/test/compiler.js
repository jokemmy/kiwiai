
require( 'babel-register' )({ // eslint-disable-line
  presets: [
    require.resolve( 'babel-preset-env' ),
    require.resolve( 'babel-preset-react' ),
    require.resolve( 'babel-preset-stage-0' )
  ],
  plugins: [
    require.resolve( 'babel-plugin-add-module-exports' )
  ]
});

const noop = () => null;
[ '.css', '.less', '.html', '.htm' ].forEach(( ext ) => {
  require.extensions[ext] = noop;
});
