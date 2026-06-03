// packages/hooks/src/useStats.ts
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@gymtracker/api-client";
import { STALE_TIMES } from "@gymtracker/constants";
// Separate query keys for stats
const statsKeys = {
    summary: () => ["stats", "summary"],
    personalBests: () => ["stats", "personal_bests"],
    streak: () => ["stats", "streak"],
    progress: (id) => ["stats", "progress", id],
};
export const useWorkoutStats = () => useQuery({
    queryKey: statsKeys.summary(),
    queryFn: () => statsApi.getSummary().then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
});
export const usePersonalBests = () => useQuery({
    queryKey: statsKeys.personalBests(),
    queryFn: () => statsApi.getPersonalBests().then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
});
// Deprecated
// export const useStreak = () =>
//   useQuery({
//     queryKey:  statsKeys.streak(),
//     queryFn:   () => statsApi.getStreak().then((r) => r.data),
//     staleTime: STALE_TIMES.workouts,
//   });
export const useExerciseProgress = (exerciseId) => useQuery({
    queryKey: statsKeys.progress(exerciseId),
    queryFn: () => statsApi.getExerciseProgress(exerciseId).then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
    enabled: !!exerciseId,
});
