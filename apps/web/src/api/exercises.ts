import api from "./axios"
import type { Exercise } from "../types"

export const getExercises = () =>
  api.get<Exercise[]>("/exercises")

export const createExercise = (data: { name: string; category: string }) =>
  api.post<Exercise>("/exercises", data)