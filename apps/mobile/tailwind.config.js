// apps/mobile/tailwind.config.js
const { theme } = require("@gymtracker/tailwind-config/native");

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme,   // ← spread the shared theme directly
  plugins: [],
};