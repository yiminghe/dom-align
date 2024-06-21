/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx', 'js'],
  experimental: {
    swcPlugins: process.env.NODE_ENV !== 'production' ? [
      [
        require.resolve('swc-plugin-coverage-instrument'),
        {
        },
      ],
    ] : [],
  },
  output: 'export',
  distDir: 'dom-align',
  basePath: process.env.NODE_ENV === 'production' ? '/dom-align' : '',
  assetPrefix:
    process.env.NODE_ENV === 'production' ? '/dom-align/' : undefined,
};
