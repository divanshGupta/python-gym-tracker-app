import { apiClient } from "./client";
import type {
  WorkoutStats,
  PersonalBests,
  StreakData,
  ExerciseProgress,
} from "@gymtracker/types";

export const statsApi = {
  // GET /stats/summary
  getSummary: () =>
    apiClient.get<WorkoutStats>("/stats/summary"),

  // GET /stats/personal_bests
  getPersonalBests: () =>
    apiClient.get<PersonalBests>("/stats/personal_bests"),

  // GET /stats/streak
  getStreak: () =>
    apiClient.get<StreakData>("/stats/streak"),

  // GET /stats/progress/:exercise_id
  getExerciseProgress: (exerciseId: number) =>
    apiClient.get<ExerciseProgress>(`/stats/progress/${exerciseId}`),
};