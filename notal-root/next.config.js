const path = require('path');
const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

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
  experimental: { optimizeCss: true },
}));