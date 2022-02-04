const path = require('path')
const withSass = require('@zeit/next-sass');
const withPWA = require('next-pwa')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withSass({
  cssModules: true
})
module.exports = withBundleAnalyzer(withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;

    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}))