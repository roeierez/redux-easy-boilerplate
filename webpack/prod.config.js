const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('../config');
const paths = config.get('utils_paths');

module.exports = {
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css?minimize!postcss-loader!less-loader'),
    }],
  },
  output: {
    path: paths.project(config.get('dir_dist_production'))
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.ProvidePlugin({
      Promise: 'exports?global.Promise!es6-promise',
      fetch: 'exports?self.fetch!whatwg-fetch',
    }),
  ],
};
