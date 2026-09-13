/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pitch: {
          DEFAULT: '#0F3D2E',
          light: '#1B5E3F',
          dark: '#0A2A20',
        },
        chalk: '#F5F0E6',
        gold: {
          DEFAULT: '#C9A227',
          light: '#E0C158',
        },
        risk: '#B33A3A',
        ink: '#12181B',
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
