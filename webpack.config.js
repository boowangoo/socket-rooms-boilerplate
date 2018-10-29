const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = {
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  mode: 'development'
};

const client = {
  entry: './client/index.ts',
  devtool: 'inline-source-map',
  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, 'dist/client'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client/html/index.html')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client/html/room.html')
    })
  ]
};

const server = {
  entry: './server/server.ts',
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'dist/server')
  },
  target: 'node',
  node: {
    __dirname: true
  },
  externals: [nodeExternals()]
};

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server)
];