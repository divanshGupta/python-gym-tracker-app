// React Query key factory — single source of truth
// Changing a key here invalidates cache everywhere
export const queryKeys = {
  workouts: {
    all:    ()         => ["workouts"] as const,
    detail: (id: string) => ["workouts", id] as const,
  },
  exercises: {
    all:      ()              => ["exercises"] as const,
    byCategory: (cat: string) => ["exercises", cat] as const,
  },
  auth: {
    me: () => ["auth", "me"] as const,
  },
} as const;