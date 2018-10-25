const path = require('path');
const nodeExternals = require('webpack-node-externals');

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
  entry: './public/js/index.ts',
  devtool: 'inline-source-map',
  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, 'dist/client')
  }
};

const server = {
  entry: './server/server.ts',
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'dist/server')
  },
  target: 'node',
  externals: [nodeExternals()]
};

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server)
];