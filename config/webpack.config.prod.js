require('dotenv').config({ path: '.env.production' });
const common = require('./common');
const solidjs = require('./solidjs');

module.exports = {
  mode: 'production',
  // Where webpack looks to start building the bundle
  entry: [common.aliases.main],
  // Where webpack outputs the assets and bundles
  output: {
    path: `${process.env.DIST_DIR}/${process.env.APP_NAME}`,
    publicPath: `${process.env.APP_HOST}:${process.env.APP_PORT}/`,
    filename: 'js/[name].[chunkhash].bundle.js',
    chunkFilename: 'js/[name].[chunkhash].chunk.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
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
  devtool: false,
  optimization: {
    minimize: true,
    sideEffects: true,
    concatenateModules: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
