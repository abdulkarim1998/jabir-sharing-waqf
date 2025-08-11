import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '490px',
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
