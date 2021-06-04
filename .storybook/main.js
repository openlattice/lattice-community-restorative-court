module.exports = {
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-docs'],
  core: {
    builder: 'webpack5',
  },
  stories: ['../stories/**/*.stories.@(js|mdx)', '../src/containers/**/*.stories.js'],
};
