module.exports = [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['solid'],
        },
      },
      {
        loader: 'ts-loader',
      },
    ]
  }
];
