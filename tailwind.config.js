/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // MLX Brand Colors
      colors: {
        primary: {
          DEFAULT: '#0D382B',
          dark: '#0D382B',
        },
        accent: {
          DEFAULT: '#009829',
          light: '#2FAA51',
          lighter: '#8ECFA2',
          lightest: '#BEE2CA',
          pale: '#D5EBDE',
        },
        neutral: {
          dark: '#7D968E',
          mid: '#C0CECA',
          light: '#D7E1DE',
        },
        contrast: '#FFFFFF',
      },
      // MLX Brand Font
      fontFamily: {
        sans: ['Poppins', 'Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
