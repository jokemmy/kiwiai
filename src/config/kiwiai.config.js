
export default {
  port: 8000,
  proxy: {
    '/api': {
      target: 'http://192.168.1.6:8020',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    }
  },
  webpackConfig: [
    'webpack.config.dev.js',
    'webpack.config.dll.js',
    'webpack.config.prod.js'
  ]
};
