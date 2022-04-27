const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules\/.+\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  // https://vuetifyjs.com/zh-Hans/getting-started/installation/#webpack-5b8988c5
  {
    test: /\.s(c|a)ss$/,
    use: [
      'vue-style-loader',
      'css-loader',
      'sass-loader'
    ],
  },
  // https://vue-loader.vuejs.org/guide/#manual-setup
  {
    test: /\.vue$/,
    use: {
      loader: 'vue-loader',
    },
  },
  {
    test: /\.svg$/,
    loader: 'svg-sprite-loader',
    include: [resolve('src/icons')],
    options: {
      symbolId: 'icon-[name]'
    }
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    type: 'asset',
    exclude: [resolve('src/icons')]
  },
  // {
  //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  //   loader: 'url-loader',
  //   options: {
  //     limit: 10000,
  //     name: '[name].[ext]',
  //     // 如果要在图片的src里使用，这里要添加esModule属性，默认是true，需要设置成false
  //     esModule: false
  //   },
  //   type: 'javascript/auto',
  //   exclude: [resolve('src/icons')]
  // },
  // Put your webpack loader rules in this array.  This is where you would put
  // your ts-loader configuration for instance:
  /**
   * Typescript Example:
   *
   * {
   *   test: /\.tsx?$/,
   *   exclude: /(node_modules|.webpack)/,
   *   loaders: [{
   *     loader: 'ts-loader',
   *     options: {
   *       transpileOnly: true
   *     }
   *   }]
   * }
   */
];
