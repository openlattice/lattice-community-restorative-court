/* eslint-disable import/no-extraneous-dependencies, no-param-reassign */
const path = require('path');

module.exports = ({ config }) => {

  const ROOT = path.resolve(__dirname, '..');
  const NODE = path.resolve(ROOT, 'node_modules');

  config.resolve.alias = {
    ...config.resolve.alias,
    // NOTE: because rjsf still depends on core-js@2
    // core-js-pure is the core-js@3 equivalent of core-js/library from core-js@2
    // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
    'core-js/library/fn/array/fill': path.resolve(NODE, 'core-js-pure/features/array/fill'),
    'core-js/library/fn/array/includes': path.resolve(NODE, 'core-js-pure/features/array/includes'),
  };

  return config;
};
