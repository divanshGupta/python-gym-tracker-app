// packages/api-client/src/stats.api/ts
import type {
  ExerciseProgress,
  PersonalBests,
  ProgressionResult,
  StreakData,
  WorkoutStats,
} from "@gymtracker/types";
import { ContributionsResponse } from "@gymtracker/types";
import { apiClient } from "./client";

interface ContributionsParams {
  from: string;
  to: string;
  source?: "workouts" | "habits" | "nutrition";
}

export const statsApi = {
  // GET /stats/summary
  getSummary: () => apiClient.get<WorkoutStats>("/stats/summary"),

  // GET /stats/personal_bests
  getPersonalBests: () => apiClient.get<PersonalBests>("/stats/personal_bests"),

  // GET /stats/streak
  getStreak: () => apiClient.get<StreakData>("/stats/streak"),

  // GET /stats/contributions
  getContributions: (params: ContributionsParams) =>
    apiClient.get<ContributionsResponse>("/stats/contributions", { params }),

  // GET /stats/progress/:exercise_id
  getExerciseProgress: (exerciseId: number) =>
    apiClient.get<ExerciseProgress>(`/stats/progress/${exerciseId}`),

  // GET /suggestions/:exercise_id
  getProgressionSuggestion: (exerciseId: number) =>
    apiClient.get<ProgressionResult>(`/suggestions/${exerciseId}`),
};
