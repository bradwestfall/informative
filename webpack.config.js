var path = require('path')
var webpack = require('webpack')

var examplePath = process.env.EXAMPLE

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    path.resolve(__dirname, 'examples', examplePath, 'index.js')
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
      'src': path.resolve('./src')
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
}
