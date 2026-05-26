// apps/mobile/tailwind.config.js
const path = require("path");
const { colors, fontFamily, radius, spacing, fontSize } = require(
  path.resolve(__dirname, "../../packages/tailwind-config/tokens.js")
);

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
      fontSize,
    },
  },
  plugins: [],
};