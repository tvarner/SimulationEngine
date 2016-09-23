// For info about this file refer to webpack and webpack-hot-middleware documentation
// For info on how we're generating bundles with hashed filenames for cache busting: https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false
};

// NOTE: The resolve section at the bottom is necessary
// to keep material-ui happy by assuring all references
// to React point to the same spot.
export default {
  debug: true,
  devtool: 'source-map', // More info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo: false, // Set to false to see a list of every file being bundled.
  entry: {
    // All vendor libraries should be imported in vendor.js. Since vendor libs rarely change, this helps save bandwidth by placing them in a separate file that can be cached separately. Anything not imported in vendor.js will be placed in main.js.
    vendor: './src/vendor.js',
    main: './src/index.js'
  },
  target: 'web',
  output: {
    path: __dirname + '/dist',
    publicPath: '',
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    // Use CommonsChunkPlugin to create a separate bundle of vendor libraries so that they're cached separately.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2
    }),

    // Hash the files using MD5 so that their names change when the content changes.
    new WebpackMd5Hash(),

    // Optimize the order that items are bundled. This assures the hash is deterministic.
    new webpack.optimize.OccurenceOrderPlugin(),

    // Pass variables to Webpack. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),

    // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true,
      // Note that you can add custom options here if you need to handle other customer logic in index.html
      trackJSToken: '69ff2d61429a4c5da881a2026decd7d7'
    }),

    // Generate an external css file with a hash in the filename
    new ExtractTextPlugin('[name].[contenthash].css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {screw_ie8: true, keep_fnames: false, warnings: false},
      mangle: {screw_ie8: true, keep_fnames: false}
    })
  ],
  module: {
    loaders: [
      {test: /(\.js|\.jsx)$/, exclude:/node_modules/, loader: 'babel'},
      {test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract(['css?sourceMap!sass?sourceMap!postcss'])},
      {test: /\.ico(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?mimetype=image/x-icon'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /\.json$/, loader: "json-loader" },
      {test: /\.(jpe?g|png|gif)$/i, loaders: ['file?name=[path][name].[ext]?[hash]']}
    ]
  },
  postcss: function () {
    return [
      require('autoprefixer')({
        browsers: 'last 3 versions, > 1%'
      })
    ];
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
