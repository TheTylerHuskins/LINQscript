const webpack = require('webpack');
const path = require('path');

const config = {
  devtool: "source-map",
  entry: {
    LinqScript: './src/index.ts',
    LinqScriptTests: './src/test/Tests.ts'
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd2'
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  }
}

module.exports = config;