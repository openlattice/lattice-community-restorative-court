module.exports = {
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }],
    ['babel-plugin-transform-imports', {
      '@fortawesome/free-solid-svg-icons': {
        transform: (importName) => `@fortawesome/free-solid-svg-icons/${importName}`,
        preventFullImport: true,
        skipDefaultConversion: true,
      },
      '@fortawesome/pro-duotone-svg-icons': {
        preventFullImport: true,
        skipDefaultConversion: true,
        transform: (importName) => `@fortawesome/pro-duotone-svg-icons/${importName}`,
      },
      '@fortawesome/pro-light-svg-icons': {
        preventFullImport: true,
        skipDefaultConversion: true,
        transform: (importName) => `@fortawesome/pro-light-svg-icons/${importName}`,
      },
      '@fortawesome/pro-regular-svg-icons': {
        preventFullImport: true,
        skipDefaultConversion: true,
        transform: (importName) => `@fortawesome/pro-regular-svg-icons/${importName}`,
      },
      '@fortawesome/pro-solid-svg-icons': {
        preventFullImport: true,
        skipDefaultConversion: true,
        transform: (importName) => `@fortawesome/pro-solid-svg-icons/${importName}`,
      },
    }],
    '@babel/plugin-proposal-class-properties',
    'babel-plugin-styled-components',
  ],
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: false,
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }],
    '@babel/preset-flow',
  ],
};
