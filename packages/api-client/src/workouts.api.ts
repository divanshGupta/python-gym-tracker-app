import { apiClient } from "./client";
import type {
  Workout,
  WorkoutInput,
  UpdateWorkoutPayload,
  WorkoutFilters,
} from "@gymtracker/types";

export const workoutsApi = {
  // GET /workouts?page=1&limit=10&type=...
  getAll: (filters?: WorkoutFilters) =>
    apiClient.get<Workout[]>("/workouts", { params: filters }),

  // GET /workouts/:id
  getById: (id: number) =>
    apiClient.get<Workout>(`/workouts/${id}`),

  // POST /workouts
  create: (data: WorkoutInput) =>
    apiClient.post<Workout>("/workouts", data),

  // PUT /workouts/:id
  update: (id: number, data: UpdateWorkoutPayload) =>
    apiClient.put<Workout>(`/workouts/${id}`, data),

  // DELETE /workouts/:id
  delete: (id: number) =>
    apiClient.delete(`/workouts/${id}`),
};