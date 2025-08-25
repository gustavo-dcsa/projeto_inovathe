/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',
        accent: '#B1D14A',
        highlight: '#F57921',
        teal: '#014D49',
        neutral: '#5F6368',
        bg: '#F8F9FA'
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'lift-sm': '0 3px 8px rgba(2,6,23,0.06)',
        'lift-md': '0 6px 18px rgba(2,6,23,0.08)'
      },
      animation: {
        'pulse-cta': 'pulseCta 2.2s ease-in-out infinite',
        'fade-up': 'fadeUp .6s ease both'
      },
      keyframes: {
        pulseCta: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(46,125,50,0.0)' },
          '70%': { transform: 'scale(1.02)', boxShadow: '0 10px 30px rgba(46,125,50,0.08)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(46,125,50,0.0)' }
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
