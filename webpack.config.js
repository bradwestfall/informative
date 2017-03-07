var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'main.js'
  },
  module: {
    rules: [

      // // First, run the linter.
      // // It's important to do this before Babel processes the JS.
      // {
      //   test: /\.js$/,
      //   enforce: 'pre',
      //   loader: 'eslint-loader',
      //   include: paths.appSrc
      // },

      // Process JS with Babel.
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}