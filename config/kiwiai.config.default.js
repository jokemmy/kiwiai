
export default {
  port: 8000,
  proxy: {},
  outputPath: 'dist',
  webpackConfigs: {
    development: 'webpack.config.dev.js',
    production: 'webpack.config.pro.js',
    dll: 'webpack.config.dll.js'
  }
};
