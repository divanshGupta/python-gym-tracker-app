// packages/types/src/workout.types.ts

import type { ExerciseCategory } from "./exercise.types"

/* =========================
   Workout Enums / Unions
========================= */

export const WORKOUT_TYPES = [
  "strength",
  "cardio",
  "flexibility",
  "core",
] as const

export type WorkoutType = (typeof WORKOUT_TYPES)[number]

/* =========================
   Workout Exercise
========================= */

export interface WorkoutExerciseDetail {
  id: number
  name: string
  category: ExerciseCategory
}

export interface WorkoutExercise {
  id: number

  exercise_id: number
  
  sets: number | null
  reps: number | null
  weight: number | null

  exercise: WorkoutExerciseDetail
}

/* =========================
   Workout Entity
========================= */

export interface Workout {
  id: number

  user_id: number

  date: string // YYYY-MM-DD

  type: WorkoutType

  duration: number | null

  calories: number | null

  notes: string | null

  workout_exercises: WorkoutExercise[]
}

/* =========================
   Payloads
========================= */

export interface WorkoutExerciseInput {
  exercise_id: number

  sets?: number | null

  reps?: number | null

  weight?: number | null
}

export interface WorkoutInput {

  date: string

  type: string

  duration?: number | null

  calories?: number | null

  notes?: string | null

  exercises: WorkoutExerciseInput[]
}

export interface UpdateWorkoutPayload
  extends Partial<WorkoutInput> {}

/* =========================
   Filters
========================= */

export interface WorkoutFilters {
  page?: number

  limit?: number

  type?: WorkoutType

  date_from?: string

  date_to?: string
}
