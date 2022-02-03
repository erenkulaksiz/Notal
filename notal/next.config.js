const path = require('path')
const withSass = require('@zeit/next-sass');
const withPWA = require('next-pwa')

module.exports = withSass({
  cssModules: true
})
module.exports = withPWA({
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

    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
})