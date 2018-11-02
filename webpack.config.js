// const path = require('path');
// const nodeExternals = require('webpack-node-externals');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// const common = {
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         use: 'ts-loader',
//         exclude: /node_modules/
//       },
//       {
//         test: /\.html$/,
//         use: 'html-loader',
//         exclude: /node_modules/
//         // options: { minimize: true }
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['.ts', '.js']
//   },
//   mode: 'development'
// };

// const client = {
//   entry: './client/index.ts',
//   devtool: 'inline-source-map',
//   output: {
//     filename: 'client.bundle.js',
//     path: path.resolve(__dirname, 'dist/client'),
//     publicPath: '/'
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: path.resolve(__dirname, 'client/index.html'),
//       filename: path.resolve(__dirname, 'dist/client/index.html')
//     })
//   ]
// };

// const server = {
//   entry: './server/server.ts',
//   output: {
//     filename: 'server.bundle.js',
//     path: path.resolve(__dirname, 'dist/server'),
//     publicPath: '/'
//   },
//   target: 'node',
//   node: {
//     __dirname: false,
//     __filename: false
//   },
//   externals: [nodeExternals()]
// };

// module.exports = [
//   Object.assign({}, common, client),
//   Object.assign({}, common, server)
// ];