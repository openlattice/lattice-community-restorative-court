/* eslint-disable import/extensions */

const path = require('path');
const Webpack = require('webpack');

const APP_CONFIG = require('../app/app.config.js');
const APP_PATHS = require('../app/paths.config.js');
const PACKAGE = require('../../package.json');

module.exports = (env = {}) => {

  /*
   * constants
   */

  const BABEL_CONFIG = path.resolve(__dirname, '../babel/babel.config.js');
  const ENV_DEV = 'development';
  const ENV_PROD = 'production';
  const LIB_FILE_NAME = 'index.js';
  const LIB_NAMESPACE = 'communityrestorativecourt';

  /*
   * loaders
   */

  const BABEL_LOADER = {
    test: /\.js$/,
    exclude: /node_modules/,
    include: [
      APP_PATHS.ABS.SOURCE,
    ],
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
    banner: APP_CONFIG.BANNER,
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
      APP_PATHS.ABS.APP,
    ],
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      },
      'styled-components': {
        amd: 'styled-components',
        commonjs: 'styled-components',
        commonjs2: 'styled-components',
      },
      lattice: {
        root: 'lattice',
        commonjs2: 'lattice',
        commonjs: 'lattice',
        amd: 'lattice'
      },
      'lattice-sagas': {
        root: 'lattice-sagas',
        commonjs2: 'lattice-sagas',
        commonjs: 'lattice-sagas',
        amd: 'lattice-sagas'
      },
      'lattice-ui-kit': {
        root: 'lattice-ui-kit',
        commonjs2: 'lattice-ui-kit',
        commonjs: 'lattice-ui-kit',
        amd: 'lattice-ui-kit'
      },
    },
    mode: env.production ? ENV_PROD : ENV_DEV,
    module: {
      rules: [
        BABEL_LOADER,
        URL_LOADER,
        CSS_LOADER,
      ],
    },
    optimization: {
      // minimize: !!env.production,
      minimize: false,
    },
    output: {
      library: LIB_NAMESPACE,
      libraryTarget: 'umd',
      path: APP_PATHS.ABS.BUILD,
      publicPath: '/',
      filename: LIB_FILE_NAME,
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
        APP_PATHS.ABS.SOURCE,
        'node_modules',
      ],
    },
    target: 'web',
  };
};
