module.exports = {
  // 修改 src 为 examples, 这样npm run serve的时候就会编译examples目录下的示例
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  /*configureWebpack:{
    externals:{
      'vue': 'Vue',
      'element-ui': 'ElementUI',
      'xlsx': 'XLSX',
      'axios': 'axios'
    },
    devtool: 'source-map',
    performance: {
      hints: 'error', 
      maxAssetSize: 500000, // 整数类型（以字节为单位）
      maxEntrypointSize: 500000 // 整数类型（以字节为单位）
    }
  },*/


  // 扩展 webpack 配置，使 packages 目录加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
        .add('/packages')
        .end()
      .use('babel')
        .loader('babel-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        })
  }
}