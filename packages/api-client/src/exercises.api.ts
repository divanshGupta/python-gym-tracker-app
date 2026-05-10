import { apiClient } from "./client";
import type { Exercise, ExerciseCategory } from "@gymtracker/types";

export const exercisesApi = {

  // GET /exercises  →  optional ?category= filter
  getAll: (category?: ExerciseCategory) =>
    apiClient.get<Exercise[]>("/exercises", {
      params: category ? { category } : undefined,
    }),

  // GET /exercises/:id 
  getById: (id: string) =>
    apiClient.get<Exercise>(`/exercises/${id}`),

  // POST /exercise
  create: (data: Partial<Exercise>) =>
    apiClient.post<Exercise>("/exercises", data),
};

// import { apiClient } from "./client";
// import type { Exercise, ExerciseCategory } from "@gymtracker/types";

// export const exercisesApi = {
//   // GET /exercises?category=strength
//   getAll: (category?: ExerciseCategory) =>
//     apiClient.get<Exercise[]>("/exercises", {
//       params: category ? { category } : undefined,
//     }),

//   // GET /exercises/:id
//   getById: (id: number) =>
//     apiClient.get<Exercise>(`/exercises/${id}`),
// };