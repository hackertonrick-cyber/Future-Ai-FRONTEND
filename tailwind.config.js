/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'Poppins', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-grey-1': '#dadce0',
        'brand-grey-2': '#f8f9fa',
        'brand-grey-3': '#80868b',
        'brand-grey-4': '#303133',
        'brand-blue-1': '#1967d2',
        'brand-blue-2': '#4285f4',
        'brand-blue-3': '#5fbae9',
        'brand-green-1': '#2e9813',
        'brand-green-2': '#0e4104',
        'brand-green-3': '#84c71c',
        'brand-green-4': '#137333',
        'brand-red-1': '#cc0000',
        'brand-red-2': '#ff0033',
        'brand-red-3': '#ed4337',
        'brand-yellow-1': '#cea643',
        'brand-yellow-2': '#efd794',
        'brand-yellow-3': '#ffba00',
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #137333 0%, #84c71c 100%)',
        'gradient-green-soft':
          'linear-gradient(135deg, #2e9813 0%, #84c71c 100%)',
        'gradient-green-reverse':
          'linear-gradient(135deg, #84c71c 0%, #137333 100%)',
        'gradient-green-soft-reverse':
          'linear-gradient(135deg, #84c71c 0%, #2e9813 100%)',

        'gradient-blue': 'linear-gradient(135deg, #1967d2 0%, #4285f4 100%)',
        'gradient-blue-reverse':
          'linear-gradient(135deg, #4285f4 0%, #1967d2 100%)',

        'gradient-blue-green':
          'linear-gradient(135deg, #1967d2 0%, #2e9813 100%)',
        'gradient-blue-green-reverse':
          'linear-gradient(135deg, #2e9813 0%, #1967d2 100%)',

        'gradient-yellow': 'linear-gradient(135deg, #cea643 0%, #ffba00 100%)',
        'gradient-yellow-reverse':
          'linear-gradient(135deg, #ffba00 0%, #cea643 100%)',

        'gradient-red': 'linear-gradient(135deg, #cc0000 0%, #ed4337 100%)',
        'gradient-red-reverse':
          'linear-gradient(135deg, #ed4337 0%, #cc0000 100%)',

        'gradient-red-alert':
          'linear-gradient(135deg, #ff0033 0%, #ed4337 100%)',
        'gradient-red-alert-reverse':
          'linear-gradient(135deg, #ed4337 0%, #ff0033 100%)',

        'gradient-grey': 'linear-gradient(135deg, #dadce0 0%, #80868b 100%)',
        'gradient-grey-reverse':
          'linear-gradient(135deg, #80868b 0%, #dadce0 100%)',
      },
      boxShadow: {
        'blue-1': '0 0 3px 3px #4285f4',
        'green-1': '0 0 3px 3px #2e9813',
        'green-2': '0 0 3px 3px #0e4104',
        'green-3': '0 0 3px 3px #84c71c',
        'green-4': '0 0 3px 3px #137333',
        'yellow-1': '0 0 3px 3px #cea643',
        'yellow-2': '0 0 3px 3px #efd794',
        'yellow-3': '0 0 3px 3px #ffba00',
        grey: '0 1px 3px 0 rgba(60, 67, .3)',
      },
      height: {
        15: '15%',
        25: '25%',
        30: '30%',
        35: '35%',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-stroke-black': {
          '-webkit-text-stroke': '1px black',
          'color': 'white',
        },
        '.text-outline-black': {
          'text-shadow': `
            -1px -1px 0 #000,
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000
          `
        },
        '.text-stroke-gold': {
          '-webkit-text-stroke': '1px #FFD700',
          'color': '#fff',
        },
        '.text-stroke-clover': {
          '-webkit-text-stroke': '1px #228B22',
          'color': '#f0fff0',
        },
        '.text-stroke-greyrock': {
          '-webkit-text-stroke': '1px #6e6e6e',
          'color': '#f8f8f8',
        },
        '.text-stroke-lucky': {
          '-webkit-text-stroke': '2px #32CD32',
          'color': '#ffffff',
        },
        '.text-stroke-rainbow': {
          '-webkit-text-stroke': '1px #ff00ff',
          'color': 'transparent',
        },
        '.text-outline-gold': {
          'text-shadow': `
            -1px -1px 0 #FFD700,
             1px -1px 0 #FFD700,
            -1px  1px 0 #FFD700,
             1px  1px 0 #FFD700
          `,
        },
        '.text-outline-clover': {
          'text-shadow': `
            -1px -1px 0 #228B22,
             1px -1px 0 #228B22,
            -1px  1px 0 #228B22,
             1px  1px 0 #228B22
          `,
        },
        '.text-outline-greyrock': {
          'text-shadow': `
            -1px -1px 0 #6e6e6e,
             1px -1px 0 #6e6e6e,
            -1px  1px 0 #6e6e6e,
             1px  1px 0 #6e6e6e
          `,
        },
      });
    },
  ],
}
