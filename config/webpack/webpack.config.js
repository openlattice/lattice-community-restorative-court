/* eslint-disable import/extensions, import/no-extraneous-dependencies */

const path = require('path');
const Webpack = require('webpack');
const externals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const PACKAGE = require('../../package.json');

const BANNER = `
${PACKAGE.name} - v${PACKAGE.version}
${PACKAGE.description}
${PACKAGE.homepage}

Copyright (c) 2017-${(new Date()).getFullYear()}, OpenLattice, Inc. All rights reserved.
`;

module.exports = (env = {}) => {

  /*
   * constants
   */

  const BABEL_CONFIG = path.resolve(__dirname, '../babel/babel.config.js');
  const ENV_DEV = 'development';
  const ENV_PROD = 'production';

  const ROOT = path.resolve(__dirname, '../..');
  const BUILD = path.resolve(ROOT, 'build');
  const NODE = path.resolve(ROOT, 'node_modules');
  const SOURCE = path.resolve(ROOT, 'src');

  /*
   * loaders
   */

  const BABEL_LOADER = {
    test: /\.js$/,
    exclude: /node_modules/,
    include: [SOURCE],
    use: {
      loader: 'babel-loader',
      options: {
        configFile: BABEL_CONFIG,
      },
    },
  };

  const CSS_LOADER = {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  };

  const URL_LOADER = {
    test: /\.(jpg|png|svg)$/,
    loader: 'url-loader',
    options: {
      limit: Infinity // everything
    }
  };

  /*
   * plugins
   */

  const BANNER_PLUGIN = new Webpack.BannerPlugin({
    banner: BANNER,
    entryOnly: true,
  });

  const DEFINE_PLUGIN = new Webpack.DefinePlugin({
    __ENV_DEV__: JSON.stringify(!!env.development),
    __ENV_PROD__: JSON.stringify(!!env.production),
    __PACKAGE__: JSON.stringify(PACKAGE.name),
    __VERSION__: JSON.stringify(`v${PACKAGE.version}`),
  });

  /*
   * base webpack config
   */

  return {
    bail: true,
    entry: [
      path.resolve(ROOT, 'src/index.js'),
    ],
    externals: [
      externals({
        allowlist: [
          'file-saver',
          'iso-639-1',
          'papaparse',
        ]
      })
    ],
    mode: env.production ? ENV_PROD : ENV_DEV,
    module: {
      rules: [
        BABEL_LOADER,
        URL_LOADER,
        CSS_LOADER,
      ],
    },
    optimization: {
      minimize: !!env.production,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
    output: {
      filename: 'index.js',
      library: {
        name: 'communityrestorativecourt',
        type: 'umd',
      },
      path: BUILD,
      publicPath: '/',
    },
    performance: {
      hints: false, // disable performance hints for now
    },
    plugins: [
      DEFINE_PLUGIN,
      BANNER_PLUGIN,
    ],
    resolve: {
      extensions: ['.js'],
      modules: [
        SOURCE,
        NODE,
      ],
    },
    target: 'web',
  };
};
