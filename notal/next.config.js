const path = require('path')
const withSass = require('@zeit/next-sass');
module.exports = withSass({
  cssModules: true
})
module.exports = {
  env: {
    API_ROUTE: 'https://61a628bc8395690017be9103.mockapi.io/api/',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['assets.vercel.com', 'localhost'],
  },
}