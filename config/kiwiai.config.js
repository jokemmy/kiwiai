
export default {
  port: 8000,
  outputPath: 'dist',
  proxy: {},
  webpackConfigs: {
    development: 'webpack.config.dev.js',
    production: 'webpack.config.pro.js',
    dll: 'webpack.config.dll.js'
  }
};
