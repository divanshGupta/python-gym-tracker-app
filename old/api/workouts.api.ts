import { apiClient } from "./client";
import type { Workout, CreateWorkoutPayload } from "../../apps/mobile/src/types/workout.types";

export const workoutsApi = {
  getAll: () => apiClient.get<Workout[]>("/workouts"),
  getById: (id: string) => apiClient.get<Workout>(`/workouts/${id}`),
  create: (data: CreateWorkoutPayload) =>
    apiClient.post<Workout>("/workouts", data),
  update: (id: string, data: Partial<CreateWorkoutPayload>) =>
    apiClient.put<Workout>(`/workouts/${id}`, data),
  delete: (id: string) => apiClient.delete(`/workouts/${id}`),
};

