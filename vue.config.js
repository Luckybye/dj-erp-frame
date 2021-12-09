/* eslint-disable */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const { getPages } = require("./build/page.js");

let entry = process.argv[3];
let pages = getPages();
if (pages[entry]) pages = { [entry]: pages[entry] };

// webpack 配置扩展
let configureWebpack = {
  plugins: [],
  externals: {
    'OSS': 'OSS',
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
    'axios': 'axios',
    'vue-i18n': 'VueI18n',
    'qrious': 'QRious',
    'umy-ui': 'UMYUI',
    'xlsx': 'XLSX',
    // 'swiper': 'Swiper'
  }
}
// --report模式，分析依赖
if (process.env.npm_config_report) configureWebpack.plugins.push(new BundleAnalyzerPlugin())

module.exports = {
  // lintOnSave: true,
  pages: {...pages},
  pwa: {
    name: 'Wokelink',
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    },
    manifestOptions: {
      start_url: './new_saas.html'
    },
    // manifestPath: 'portal/manifest.json',
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    port: 3001,
    proxy: {
      '/*.html': {
        target: 'http://120.26.86.173:8087',
        changeOrigin: true
      },
      '/x': {
        target: 'http://120.26.86.173:8087',
        // target: 'http://localhost',
        changeOrigin: true
      },
      '/api': {
        target: 'http://120.26.86.173:8087',
        // target: 'http://localhost',
        changeOrigin: true
      },
      '/support': {
        target: 'http://120.26.86.173:8087',
        // target: 'http://localhost',
        changeOrigin: true
      },
    }
  },
  configureWebpack,
  chainWebpack: config => {
    // 优化启动时间
    // config.cache(true)
    // config.plugin('cache').use(HardSourceWebpackPlugin)

    let svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/portal/'
  //   : '/',
  assetsDir: 'portal',
  productionSourceMap: false
}
