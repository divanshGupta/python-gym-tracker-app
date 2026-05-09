/** @type {import('tailwindcss').Config} */
const {
  colors,
  fontFamily,
  radius,
  spacing,
} = require("../../packages/constants/token");


module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors,
      fontFamily,
      borderRadius: radius,
      spacing,
    },
  },
};