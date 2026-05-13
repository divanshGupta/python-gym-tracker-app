import { apiClient } from "./client";
import type {
  Goal,
  GoalProgress,
  CreateGoalPayload,
  UpdateGoalPayload,
  LogGoalProgressPayload,
} from "@gymtracker/types";

export const goalsApi = {
  // GET /goals?status=active
  getAll: (status?: string) =>
    apiClient.get<Goal[]>("/goals", {
      params: status ? { status } : undefined,
    }),

  // GET /goals/:id
  getById: (id: number) =>
    apiClient.get<Goal>(`/goals/${id}`),

  // POST /goals
  create: (data: CreateGoalPayload) =>
    apiClient.post<Goal>("/goals", data),

  // PATCH /goals/:id  ← backend uses PATCH not PUT
  update: (id: number, data: UpdateGoalPayload) =>
    apiClient.patch<Goal>(`/goals/${id}`, data),

  // DELETE /goals/:id
  delete: (id: number) =>
    apiClient.delete(`/goals/${id}`),

  // POST /goals/:id/progress
  logProgress: (goalId: number, data: LogGoalProgressPayload) =>
    apiClient.post<GoalProgress>(`/goals/${goalId}/progress`, data),
};