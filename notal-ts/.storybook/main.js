const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  "webpackFinal": (config) => {
    config.resolve.alias = {
      ...config.resolve?.alias,
      '@components': [path.resolve(__dirname, '../src/components')],
      '@icons': [path.resolve(__dirname, '../src/icons')],
      '@utils': [path.resolve(__dirname, '../src/utils')],
      '@public': [path.resolve(__dirname, '../public')],
      '@services': [path.resolve(__dirname, '../src/services')],
      '@hooks': [path.resolve(__dirname, '../src/hooks')],
      '@api': [path.resolve(__dirname, '../src/api')],
      '@lib': [path.resolve(__dirname, '../src/lib')],
      '@constants': [path.resolve(__dirname, '../src/constants')],
      '@types': [path.resolve(__dirname, '../src/types')],
    };
    config.resolve.roots = [
      path.resolve(__dirname, '../public'),
      'node_modules',
    ];
    config.module.rules = [
      ...config.module.rules.map(rule => {
        if (/svg/.test(rule.test)) {
          return { ...rule, exclude: /\.svg$/i }
        }
        return rule
      }),
      {
        test: /\.svg$/i,
        use: ['@svgr/webpack']
      }
    ]
    return config;
  },
  "typescript": { reactDocgen: false },
  "staticDirs": ['../public'],
}