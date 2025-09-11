/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Poppins', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        home: "url('../assets/brasacomopacity.jpg')"
      },
      colors: {
        'brand-red': '#dc2626',
        'brand-yellow': '#f59e0b',
      }
    },
  },
  plugins: [],
}

