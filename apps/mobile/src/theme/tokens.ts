export const tokens = {
  colors: {
    accent:          "#7C5CFC",
    accentLight:     "#9B7EFD",
    accentSubtle:    "#EDE8FF",
    void:            "#141414",
    surface:         "#1C1C1E",
    elevated:        "#2C2C2E",
    textPrimary:     "#FFFFFF",
    textSecondary:   "#8E8E93",
    textTertiary:    "#636366",
    borderDefault:   "#2C2C2E",
    borderStrong:    "#3A3A3C",
    success:         "#22C55E",
    danger:          "#EF4444",
    warning:         "#F59E0B",
  },
  radius: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 24, full: 9999,
  },
  spacing: {
    1: 4, 2: 8, 3: 12, 4: 16, 5: 20,
    6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
  },
} as const;

export type Tokens = typeof tokens;