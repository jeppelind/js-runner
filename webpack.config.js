/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    entry: './src/gui/index.tsx',
    target: 'electron-renderer',
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
    },
    module: {
      rules: [{
        test: /\.ts(x?)$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }],
      }],
    },
    output: {
      path: `${__dirname}/dist/gui`,
      filename: 'index.js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/gui/index.html',
      }),
    ],
  },
];
