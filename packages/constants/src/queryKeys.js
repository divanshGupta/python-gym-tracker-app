// Single source of truth for all React Query cache keys.
// Changing a key here invalidates cache on both web and mobile.
// Using factory functions means you get type-safe, consistent keys everywhere.
export const queryKeys = {
    // Auth
    auth: {
        me: () => ["auth", "me"],
    },
    // Exercises — read-only reference data
    exercises: {
        all: () => ["exercises"],
        byCategory: (cat) => ["exercises", "category", cat],
        detail: (id) => ["exercises", "detail", id],
    },
    // Workouts — user-specific, needs frequent invalidation
    workouts: {
        all: () => ["workouts"],
        detail: (id) => ["workouts", "detail", id],
    },
    measurements: {
        all: () => ["measurements"],
        detail: (id) => ["measurements", "detail", id],
    },
    stats: {
        summary: () => ["stats", "summary"],
        personalBests: () => ["stats", "personalBests"],
        streak: () => ["stats", "streak"],
        progress: (exerciseId) => ["stats", "progress", exerciseId],
        contributions: (range) => ["stats", "contributions", range],
    },
};
