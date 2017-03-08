var path = require('path')
var webpack = require('webpack')

var examplePath = process.env.EXAMPLE

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, examplePath, 'index.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: {
      //'src': path.resolve('./src')
      'src': path.resolve('./dist/commonjs')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: 'babel-loader',
        exclude: /node_mudles/
      }
    ]
  }
};
