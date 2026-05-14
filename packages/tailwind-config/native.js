// packages/tailwind-config/native.js
// For NativeWind v2 — spread theme.extend directly in mobile tailwind.config.js
// NativeWind v2 needs the theme spread directly — no preset support

const { colors, fontFamily, radius, spacing, fontSize } = require("./tokens");

module.exports = {
  theme: {
    extend: {
      colors,
      fontFamily,
      borderRadius: radius,
      spacing,
      fontSize,
    },
  },
};