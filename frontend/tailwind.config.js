/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mindmarket: {
          1: '#2EA7F2',
          2: '#76D95B',
          3: '#96D966',
          4: '#F2CD13',
          5: '#F2695C',
        }
      }
    },
  },
  plugins: [],
}
