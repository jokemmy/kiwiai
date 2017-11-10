#!/usr/bin/env node

require( 'babel-polyfill' );

require( 'source-map-support' ).install();

require( 'css-modules-require-hook' )({
  extensions: [ '.scss', '.less' ],
  preprocessCss( data, filename ) {
    return require( 'node-sass' ).renderSync({
      data,
      file: filename
    }).css;
  },
  camelCase: true,
  generateScopedName: '[name]__[local]__[hash:base64:8]'
});


require( './utils/registerBabel' );
