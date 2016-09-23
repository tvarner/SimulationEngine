// For info about this file refer to webpack and webpack-hot-middleware documentation
import webpack from 'webpack';
import NpmInstallPlugin from 'npm-install-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';

export default {
  debug: true,
  devtool: 'cheap-module-eval-source-map', // More info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo: true, // Set to false to see a list of every file being bundled.
  entry: [
    'eventsource-polyfill', // Necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', // Note that it reloads the page if hot module reloading fails.
    './src/index'
  ],
  target: 'web',
  output: { // Note: Only prod environment actually outputs files.
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new StyleLintPlugin({
      files: '**/*.s?(a|c)ss',
      syntax: 'scss'
    }),

    // Create HTML file that includes references to bundled CSS and JS.
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      inject: true
    }),

    // Automatically install uninstalled dependencies
    new NpmInstallPlugin({
      dev: function(module) {
        return [
          'babel-preset-react-hmre',
          'webpack-dev-middleware',
          'webpack-hot-middleware'
        ].indexOf(module) !== -1;
      }
    })
  ],
  module: {
    loaders: [
      {test: /(\.js|\.jsx)$/, exclude:/node_modules/, loader: 'babel'},
      {test: /(\.css|\.scss)$/, loader: 'style!css?sourceMap!postcss!sass?sourceMap'},
      {test: /\.ico(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?mimetype=image/x-icon'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /\.json$/, loader: "json-loader" },
      {test: /\.(jpe?g|png|gif)$/i, loaders: ['file']}
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
