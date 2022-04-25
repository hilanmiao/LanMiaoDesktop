const { VueLoaderPlugin } = require('vue-loader')
const rules = require('./webpack.rules');
const path = require("path");

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    // https://vue-loader.vuejs.org/guide/#manual-setup
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, './src')
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node']

  }
};
