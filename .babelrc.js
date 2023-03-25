console.log('Load babel config')

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: { node: 'current' },
      },
    ],
    '@babel/preset-typescript',
  ],
}
