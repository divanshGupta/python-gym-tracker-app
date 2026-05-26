// apps/mobile/tailwind.config.js
const path = require("path");
const { colors, fontFamily, radius, spacing, fontSize } = require(
  path.resolve(__dirname, "../../packages/tailwind-config/tokens.js")
);

// React Native requires letterSpacing to be a number, not a string (like "0.06em" or "-0.5px").
// We clean the fontSize options to convert/remove any string letterSpacing values.
const cleanFontSize = {};
Object.entries(fontSize).forEach(([key, val]) => {
  if (Array.isArray(val)) {
    const size = val[0];
    const options = { ...val[1] };
    if (options.letterSpacing) {
      if (typeof options.letterSpacing === "string") {
        if (options.letterSpacing.endsWith("em")) {
          const emVal = parseFloat(options.letterSpacing);
          const pxSize = parseFloat(size);
          options.letterSpacing = emVal * pxSize;
        } else if (options.letterSpacing.endsWith("px")) {
          options.letterSpacing = parseFloat(options.letterSpacing);
        } else {
          delete options.letterSpacing;
        }
      }
    }
    cleanFontSize[key] = [size, options];
  } else {
    cleanFontSize[key] = val;
  }
});

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
      fontSize: cleanFontSize,
    },
  },
  plugins: [],
};