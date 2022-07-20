const { defineConfig } = require('@vue/cli-service')
const path = require('path')

/**
 * @author MaZiXiao
 * @date 2022-07-15 17:06
 */

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  chainWebpack(config) {
    // 设置 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  transpileDependencies: true,
  devServer: {
    open: true,
    port: 9999,
    host: 'localhost',
    https: false,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
})
