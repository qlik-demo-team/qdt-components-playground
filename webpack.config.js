const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: ['babel-polyfill', './src/index'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: path.resolve(__dirname),
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
          plugins: ['transform-decorators-legacy', 'transform-object-rest-spread', 'transform-class-properties'],
        },
      },
      {
        test: /\.(js)$/,
        include: path.resolve(__dirname),
        exclude: /(node_modules)/,
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        test: /\.(less|css)$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new webpack.ProvidePlugin({
      "Hammer": "hammerjs/hammer"
    }),
    // new CopyWebpackPlugin([
    //   { from: 'src/assets', to: 'assets' },
    // ]),
  ],
  resolve: {
    extensions: ['.js'],
    plugins: [
      new DirectoryNamedWebpackPlugin(),
    ]
  },
};
