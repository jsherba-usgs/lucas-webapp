const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
  devtool: isProd ? 'hidden-source-map' : 'cheap-eval-source-map',
  context: path.join(__dirname, './src'),
  entry: {
    lucas: './app.js',
    theme: './index.js',
    download: './download.js',
   // vendor: ['jquery','smooth-scroll', 'd3', 'leaflet', 'bootstrap', 'leaflet-tilelayer-geojson'],
    vendor: ['jquery', 'smooth-scroll', 'd3', 'leaflet', 'leaflet-tilelayer-geojson'],
    vendor2: ['smooth-scroll','bootstrap',]
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: '[name]-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?retainLines=true'
        ]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: 'url-loader?limit=10000?name=images/[name].[ext]'
      },
    ],
  },
  resolve: {
    extensions: ['', '.js'],
    modules: [
      path.resolve('./src'),
      'node_modules'
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['bundle1'],
      minChunks: Infinity,
      filename: 'vendor.bundle.js'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor2',
      chunks: ['bundle2'],
      minChunks: Infinity,
      filename: 'vendor.bundle2.js'
    }),
    /*new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
    }),*/
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
  ],
  devServer: {
    contentBase: './src'
    // hot: true
  }
};
