// packages/hooks/src/useStats.ts
import { statsApi } from "@gymtracker/api-client";
import { STALE_TIMES } from "@gymtracker/constants";
import { useQuery } from "@tanstack/react-query";

// Separate query keys for stats
const statsKeys = {
  summary: () => ["stats", "summary"] as const,
  personalBests: () => ["stats", "personal_bests"] as const,
  streak: () => ["stats", "streak"] as const,
  progress: (id: number) => ["stats", "progress", id] as const,
};

export const useWorkoutStats = () =>
  useQuery({
    queryKey: statsKeys.summary(),
    queryFn: () => statsApi.getSummary().then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
  });

export const usePersonalBests = () =>
  useQuery({
    queryKey: statsKeys.personalBests(),
    queryFn: () => statsApi.getPersonalBests().then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
  });

export const useExerciseProgress = (exerciseId: number) =>
  useQuery({
    queryKey: statsKeys.progress(exerciseId),
    queryFn: () => statsApi.getExerciseProgress(exerciseId).then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
    enabled: !!exerciseId,
  });
