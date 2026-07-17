import { apiClient } from "./client";
import type { Exercise, ExerciseCategory, CreateExercisePayload, UpdateExercisePayload } from "@gymtracker/types";

export const exercisesApi = {

  // GET /exercises  →  optional ?category= filter
  getAll: (category?: ExerciseCategory) =>
    apiClient.get<Exercise[]>("/exercises", {
      params: category ? { category } : undefined,
    }),

  // GET /exercises/:id 
  getById: (id: number) =>
    apiClient.get<Exercise>(`/exercises/${id}`),

  // POST /exercises
  create: (data: CreateExercisePayload) =>
    apiClient.post<Exercise>("/exercises", data),

  // PATCh /exercises/:id
  update: (id: number, data: UpdateExercisePayload) => 
    apiClient.patch<Exercise>(`/exercises/${id}`, data),

  // DELETE /exercises/:id
  delete: (id: number) => 
    apiClient.delete<void>(`/exercises/${id}`),
};
