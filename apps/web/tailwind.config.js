const {
  colors,
  spacing,
  radius,
  fontSize,
} = require("../../packages/constants/token");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors,
      spacing,
      borderRadius: radius,
      fontSize,
    },
  },
};