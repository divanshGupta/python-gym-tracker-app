import api from "./axios"
import type { Workout, Stats, PersonalBests }  from "../types"

export interface WorkoutFilters {
  page?: number
  limit?: number
  type?: string
  date_from?: string
  date_to?: string
}

export interface WorkoutExerciseInput {
  exercise_id: number
  sets?: number
  reps?: number
  weight?: number
}

export interface WorkoutInput {
  date: string
  type: string
  duration?: number
  calories?: number
  notes?: string
  exercises: WorkoutExerciseInput[]
}

export const getWorkouts = (params?: WorkoutFilters) => api.get("/workouts", { params })
export const getWorkout = (id: number) => api.get(`/workouts/${id}`)
export const createWorkout = (data: WorkoutInput) => api.post("/workouts", data)
export const updateWorkout = (id: number, data: Partial<WorkoutInput>) => api.put(`/workouts/${id}`, data)
export const deleteWorkout = (id: number) => api.delete(`/workouts/${id}`)
export const getStats = () => api.get("/stats/summary")
export const getPersonalBests = () => api.get("/stats/personal_bests")