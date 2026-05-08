// Shared app-wide constants — same values on web and mobile

export const APP_CONFIG = {
  name:    "GymTracker",
  version: "1.0.0",
} as const;

export const WEIGHT_UNITS = [
  { value: "kg",  label: "kg"  },
  { value: "lbs", label: "lbs" },
] as const;

export type WeightUnit = typeof WEIGHT_UNITS[number]["value"];
// → "kg" | "lbs"

export const DEFAULT_WEIGHT_UNIT: WeightUnit = "kg";

export const REST_TIMER_PRESETS = [
  { value: 30,  label: "30s" },
  { value: 60,  label: "1m"  },
  { value: 90,  label: "1m 30s" },
  { value: 120, label: "2m"  },
  { value: 180, label: "3m"  },
] as const;

// Stale times for React Query — centralized so both apps use same cache policy
export const STALE_TIMES = {
  exercises: 1000 * 60 * 10,  // 10 min — exercises rarely change
  workouts:  1000 * 60 * 2,   // 2 min  — workouts change often
  auth:      1000 * 60 * 5,   // 5 min
} as const;