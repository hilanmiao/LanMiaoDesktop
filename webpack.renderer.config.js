const { VueLoaderPlugin } = require('vue-loader')
const rules = require('./webpack.rules');

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
  ]
};
