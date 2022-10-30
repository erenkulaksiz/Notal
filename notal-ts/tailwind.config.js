/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "landing_bg_2": "url('../public/landing_bg_2.png')",
        "landing_bg_3": "url('../public/landing_bg_3.png')",
      },
      keyframes: {
        landingBounce: {
          '0%': { transform: 'translateY(0px)', opacity: 1 },
          '50%': { transform: 'translateY(-16px)', opacity: .65 },
          '100%': { transform: 'translateY(0px)', opacity: 1 },
        }
      },
    }
  },
  plugins: [],
}
