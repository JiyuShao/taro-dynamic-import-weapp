module.exports = {
  babelrcRoots: ['.', 'packages/*'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        ignoreBrowserslistConfig: true,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-nullish-coalescing-operator'],
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-class-properties'],
  ],
};
