const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        "landing_bg_2": "url('../public/landing_bg_2.png')",
        "landing_bg_3": "url('../public/landing_bg_3.png')",
      }),
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}