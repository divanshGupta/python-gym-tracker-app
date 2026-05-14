// packages/tailwind-config/tokens.js
// One file. Both web (Tailwind v4) and mobile (NativeWind v2) read from here.
// Plain JS — no TypeScript, no imports — so both config systems can require() it.

const colors = {
  // ── Brand ─────────────────────────────────────────────────────────────
  accent:           "#7C5CFC",
  "accent-light":   "#9B7EFD",
  "accent-subtle":  "#EDE8FF",
  "accent-text":    "#4B2FCC",

  // ── Backgrounds ───────────────────────────────────────────────────────
  void:             "#141414",   // page background
  surface:          "#1C1C1E",   // card background
  elevated:         "#2C2C2E",   // input, raised element
  "off-white":      "#F5F5F7",   // light mode page bg

  // ── Text ──────────────────────────────────────────────────────────────
  "text-primary":   "#FFFFFF",
  "text-secondary": "#8E8E93",
  "text-tertiary":  "#636366",
  "text-inverse":   "#141414",

  // ── Borders ───────────────────────────────────────────────────────────
  "border-default": "#2C2C2E",
  "border-strong":  "#3A3A3C",

  // ── Semantic ──────────────────────────────────────────────────────────
  success:          "#22C55E",
  danger:           "#EF4444",
  warning:          "#F59E0B",
};

const fontFamily = {
  sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system"],
};

// Border radius — named scale
const radius = {
  xs:   "4px",
  sm:   "8px",
  md:   "12px",
  lg:   "16px",
  xl:   "24px",
  full: "9999px",
};

// Spacing — 4px base grid
const spacing = {
  px:  "1px",
  0:   "0px",
  0.5: "2px",
  1:   "4px",
  1.5: "6px",
  2:   "8px",
  2.5: "10px",
  3:   "12px",
  3.5: "14px",
  4:   "16px",
  5:   "20px",
  6:   "24px",
  7:   "28px",
  8:   "32px",
  9:   "36px",
  10:  "40px",
  11:  "44px",
  12:  "48px",
  14:  "56px",
  16:  "64px",
  20:  "80px",
  24:  "96px",
};

// Font sizes with line heights
const fontSize = {
  "2xs": ["11px", { lineHeight: "16px", letterSpacing: "0.06em" }],
  xs:    ["12px", { lineHeight: "16px" }],
  sm:    ["13px", { lineHeight: "20px" }],
  base:  ["14px", { lineHeight: "22px" }],
  md:    ["16px", { lineHeight: "24px" }],
  lg:    ["20px", { lineHeight: "28px" }],
  xl:    ["26px", { lineHeight: "32px", letterSpacing: "-0.5px" }],
  "2xl": ["32px", { lineHeight: "38px", letterSpacing: "-0.5px" }],
};

module.exports = { colors, fontFamily, radius, spacing, fontSize };