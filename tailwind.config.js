/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './src/**/*.component.html',
    './src/**/*.component.ts'
  ],
  safelist: [
    'space-x-14',
    'space-y-10',
    'md:space-x-14',
    'md:space-y-0',
  ],
  theme: {
    fontFamily: {
      'garamond': ['"EB Garamond"'],
    },
    container: {
      center: true,
      padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          md: '4rem',
          lg: '12rem',
          xl: '14rem',
      },
    },
  },
  // plugins: [
  //   require('daisyui'), 
  //   require('tailwind-scrollbar'),
  // ],
  // daisyui: {
  //   themes: [
  //     {
  //       mytheme: {
  //           "primary": "#eb6e54",
  //           "primary-content": "#ffffff",
  //           "secondary": "#0885db",
  //           "neutral": "#414141",
  //           "neutral-content": "#ffffff",
  //           "accent": "#969696",
  //           "base-100": "#212121",
  //           "--rounded-btn": "0.375rem",
  //       },
  //     },
  //   ],
  // },
};