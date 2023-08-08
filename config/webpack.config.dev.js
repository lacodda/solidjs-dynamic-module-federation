require('dotenv').config({ path: '.env.development' });
const common = require('./common');
const solidjs = require('./solidjs');

module.exports = {
  mode: 'development',
  // Where webpack looks to start building the bundle
  entry: [common.aliases.main],
  // Where webpack outputs the assets and bundles
  output: {
    path: common.aliases.build,
    publicPath: `${process.env.APP_HOST}:${process.env.APP_PORT}/`,
    filename: 'js/[name].[contenthash].bundle.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  resolve: {
    modules: [common.aliases.src, 'node_modules'],
    extensions: ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.wasm', '.css', '.svelte'],
    alias: { ...common.aliases, ...solidjs.aliases },
  },
  module: {
    rules: [...common.rules, ...solidjs.rules],
  },
  plugins: [...common.plugins, ...solidjs.plugins],
  stats: 'errors-warnings',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  cache: false,
  target: 'web',
  devServer: {
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: process.env.APP_PORT,
    static: './',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    onListening: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      // eslint-disable-next-line no-console
      console.log(`APP_LISTENING|${process.env.APP_NAME}|${process.env.APP_HOST}|${process.env.APP_PORT}`);
    },
  },
};
