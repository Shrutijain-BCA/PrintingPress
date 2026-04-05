/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF3E8',
          100: '#FFE0C0',
          500: '#FF6B00',
          600: '#E55F00',
          700: '#CC5500',
        },
      },
    },
  },
  plugins: [],
}
