import type { ExerciseCategoryValue } from "./exercise.constants";

// Single source of truth for all React Query cache keys.
// Changing a key here invalidates cache on both web and mobile.
// Using factory functions means you get type-safe, consistent keys everywhere.

export const queryKeys = {
  // Auth
  auth: {
    me: ()  => ["auth", "me"] as const,
  },

  // Exercises — read-only reference data
  exercises: {
    all:        ()                          => ["exercises"] as const,
    byCategory: (cat: ExerciseCategoryValue) => ["exercises", "category", cat] as const,
    detail:     (id: string)                => ["exercises", "detail", id] as const,
  },

  // Workouts — user-specific, needs frequent invalidation
  workouts: {
    all:    ()          => ["workouts"] as const,
    detail: (id: string) => ["workouts", "detail", id] as const,
  },
} as const;