const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
  ...defaultConfig,
  entry: {
    pm: './views/assets/src/index.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'views/assets/dist'),
    filename: '[name].js',
    publicPath: 'auto',
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
  externals: {
    jquery: 'jQuery',
  },
};
