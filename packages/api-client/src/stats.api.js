// packages/api-client/src/stats.api/ts
import { apiClient } from "./client";
export const statsApi = {
    // GET /stats/summary
    getSummary: () => apiClient.get("/stats/summary"),
    // GET /stats/personal_bests
    getPersonalBests: () => apiClient.get("/stats/personal_bests"),
    // GET /stats/streak
    getStreak: () => apiClient.get("/stats/streak"),
    // GET /stats/contributions
    getContributions: (params) => apiClient.get("/stats/contributions", { params }),
    // GET /stats/progress/:exercise_id
    getExerciseProgress: (exerciseId) => apiClient.get(`/stats/progress/${exerciseId}`),
};
