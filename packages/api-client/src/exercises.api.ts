import { apiClient } from "./client";
import type { Exercise } from "@gymtracker/types";

export const exercisesApi = {

  // GET /exercises  →  optional ?category= filter
  getAll: (category?: string) =>
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