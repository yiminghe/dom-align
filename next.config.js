module.exports = {
  output: 'export',
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  distDir: 'dom-align',
  basePath: process.env.NODE_ENV === 'production' ? '/dom-align' : '',
  assetPrefix:
    process.env.NODE_ENV === 'production' ? '/dom-align/' : undefined,
};
