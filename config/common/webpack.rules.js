const { isDev } = require('./webpack.helpers');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  {
    // Typescript loader
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    // CSS, SCSS (SASS) Loader
    test: /\.(sass|scss|css)$/,
    use: [
      { loader: isDev() ? 'style-loader' : MiniCssExtractPlugin.loader },
      {
        loader: 'css-loader',
        options: {
          importLoaders: isDev() ? 1 : 2,
          sourceMap: isDev(),
          modules: isDev(),
        },
      },
      { loader: 'postcss-loader', options: { sourceMap: isDev() } },
      { loader: 'sass-loader', options: { sourceMap: isDev() } },
    ],
  },
  // Images: Copy image files to build folder
  {
    test: /\.(?:ico|gif|png|jpe?g)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'assets/[hash][ext][query]',
    },
  },
  // Fonts and SVGs: Inline files
  {
    test: /\.(woff(2)?|eot|ttf|otf|svg|)$/i,
    type: 'asset/inline',
  },
];
