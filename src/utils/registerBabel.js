
if ( process.env.NODE_ENV !== 'test' ) {
  // eslint-disable-next-line
  require( 'babel-register' )({
    only: /(src\/|mock\/|webpack\.config(\.dev|\.prod|\.dll)?\.js|kiwiai(\.config|\.mock)?\.js|[^.]*\.config\.js)/,
    presets: [
      require.resolve( 'babel-preset-env' ),
      require.resolve( 'babel-preset-react' ),
      require.resolve( 'babel-preset-stage-0' )
    ],
    plugins: [
      require.resolve( 'babel-plugin-add-module-exports' )
    ],
    babelrc: false
  });
}
