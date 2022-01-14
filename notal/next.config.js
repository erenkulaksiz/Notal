const path = require('path')
const withSass = require('@zeit/next-sass');
const nextBuildId = require('next-build-id');

module.exports = withSass({
  cssModules: true
})
module.exports = {
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
}