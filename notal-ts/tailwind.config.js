/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        border: 'border 4s ease infinite',
      },
      backgroundImage: {
        "landing_bg_2": "url('../public/landing_bg_2.png')",
        "landing_bg_3": "url('../public/landing_bg_3.png')",
        "navbar_light": "radial-gradient(rgba(0, 0, 0, 0) 1px, white 1px)",
        "navbar_dark": "radial-gradient(rgba(0, 0, 0, 0) 1px, black 7px)"
      },
      keyframes: {
        landingBounce: {
          '0%': { transform: 'translateY(0px)', opacity: 1 },
          '50%': { transform: 'translateY(-16px)', opacity: .65 },
          '100%': { transform: 'translateY(0px)', opacity: 1 },
        },
        border: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    }
  },
  plugins: [],
}
