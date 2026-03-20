const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

// Resolve webpack from wp-scripts' dependencies (same version, no mismatch)
const wpScriptsDir = path.dirname(require.resolve('@wordpress/scripts/config/webpack.config'));
const webpack = require(require.resolve('webpack', { paths: [wpScriptsDir] }));

module.exports = {
  ...defaultConfig,
  entry: {
    pm: './views/assets/src/index.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'views/assets/dist'),
    filename: '[name].js',
    publicPath: 'auto',
    clean: true,
  },
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...(defaultConfig.resolve?.alias || {}),
      '@':           path.resolve(__dirname, 'views/assets/src'),
      '@components': path.resolve(__dirname, 'views/assets/src/components'),
      '@store':      path.resolve(__dirname, 'views/assets/src/store'),
      '@hooks':      path.resolve(__dirname, 'views/assets/src/hooks'),
      '@lib':        path.resolve(__dirname, 'views/assets/src/lib'),
    },
    extensions: ['.jsx', '.js', '.json'],
  },
  optimization: {
    ...defaultConfig.optimization,
    splitChunks: false,
    runtimeChunk: false,
  },
  plugins: [
    ...(defaultConfig.plugins || []),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
  externals: {
    jquery: 'jQuery',
  },
};
