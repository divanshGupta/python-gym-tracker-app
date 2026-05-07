import { apiClient } from "./client";
import type { Workout, CreateWorkoutPayload } from "@gymtracker/types";

export const workoutsApi = {

  // GET /workouts
  getAll: () => apiClient.get<Workout[]>("/workouts"),

  // GET /workouts/:id
  getById: (id: string) => apiClient.get<Workout>(`/workouts/${id}`),

  // POST /workouts
  create: (data: CreateWorkoutPayload) => apiClient.post<Workout>("/workouts", data),

  update: (id: string, data: Partial<CreateWorkoutPayload>) =>
    apiClient.put<Workout>(`/workouts/${id}`, data),

  delete: (id: string) => apiClient.delete(`/workouts/${id}`),
};