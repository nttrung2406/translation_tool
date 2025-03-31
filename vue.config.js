const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    experiments: {
      asyncWebAssembly: true
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VITE_GEMINI_API_KEY: JSON.stringify(process.env.VITE_GEMINI_API_KEY)
        }
      })
    ]
  },
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      Object.assign(definitions[0], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  },
  devServer: {
    port: 3020,
    host: '0.0.0.0',
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
