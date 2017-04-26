
export default {
  port: 8000,
  proxy: {
    '/api': {
      target: 'http://192.168.1.6:8020',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  },
  // webpackConfig: {
  //   dev: 'webpack.config.dev.js',
  //   dll: 'webpack.config.dll.js',
  //   prod: 'webpack.config.prod.js'
  // }
};
