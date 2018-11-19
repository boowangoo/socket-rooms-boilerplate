const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/index.ts',
  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, 'dist/client'),
    publicPath: '/'
  },
  mode: 'development',
  target: 'web',
  node: {
    fs: 'empty'
  },
  resolve: { extensions: ['.ts', '.js'] },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules/
        // options: { minimize: true }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client/index.html'),
      filename: path.resolve(__dirname, 'dist/client/index.html')
    })
  ]
};