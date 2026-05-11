// packages/api-client/src/exercises.api.ts
import { apiClient } from "./client";
import type { Exercise, ExerciseCategory } from "@gymtracker/types";

export interface CreateExercisePayload {
  name:          string;
  category:      string;
  muscle_group?: string | null;   // optional
  equipment?:    string | null;   // optional
  description?:  string | null;
}

export const exercisesApi = {

  // GET /exercises  →  optional ?category= filter
  getAll: (category?: ExerciseCategory) =>
    apiClient.get<Exercise[]>("/exercises", {
      params: category ? { category } : undefined,
    }),

  // GET /exercises/:id 
  getById: (id: number) =>
    apiClient.get<Exercise>(`/exercises/${id}`),

  // POST /exercise
  create: (data: CreateExercisePayload) =>
    apiClient.post<Exercise>("/exercises", data),
};
