import api from "./axios"
import type { Goal, GoalProgress } from "../types"

export const getGoals = (status?: string) =>
  api.get<Goal[]>("/goals/", { params: status ? { status } : {} }).then((r) => r.data)

export const createGoal = (data: {
  title: string
  goal_type: string
  target_value: number
  unit?: string
  exercise_id?: number
  deadline?: string
}) => api.post<Goal>("/goals/", data).then((r) => r.data)

export const updateGoal = (id: number, data: {
  title?: string
  target_value?: number
  deadline?: string
  status?: string
}) => api.patch<Goal>(`/goals/${id}`, data).then((r) => r.data)

export const deleteGoal = (id: number) =>
  api.delete(`/goals/${id}`)

export const logGoalProgress = (goalId: number, data: {
  value: number
  date: string
  notes?: string
}) => api.post<GoalProgress>(`/goals/${goalId}/progress`, data).then((r) => r.data)