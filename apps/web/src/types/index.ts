// apps/web/src/types/index.ts 
export interface User {
  id: number
  username: string
  email: string
  created_at: string
}

export interface Exercise {
  id: number
  name: string
  category: string
}

export interface WorkoutExercise {
  id: number
  exercise_id: number
  sets: number | null
  reps: number | null
  weight: number | null
  exercise: Exercise
}

export interface Workout {
  id: number
  user_id: number
  date: string
  type: string
  duration: number | null
  calories: number | null
  notes: string | null
  workout_exercises: WorkoutExercise[]
}

export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface Stats {
  total_workouts: number
  total_duration_minutes: number
  total_calories_burned: number
  workouts_by_type: Record<string, number>
  most_logged_exercise: string | null
}

export interface PersonalBest {
  exercise: string
  max_weight_kg: number
}

export interface PersonalBests {
  personal_bests: PersonalBest[]
}

export interface StreakData {
  current_streak: number
  longest_streak: number
  last_workout: string | null
}

export type GoalType =
  | "workout_frequency"
  | "lift_target"
  | "body_weight"
  | "progressive_overload"

export type GoalStatus = "active" | "completed" | "abandoned"

export interface GoalProgress {
  id: number
  goal_id: number
  value: number
  date: string
  notes?: string
  logged_at: string
}

export interface Goal {
  id: number
  user_id: number
  title: string
  goal_type: GoalType
  target_value: number
  current_value?: number
  unit?: string
  exercise_id?: number
  deadline?: string
  status: GoalStatus
  created_at: string
  progress: GoalProgress[]
}

export interface Measurement {
  id: number
  user_id: number
  date: string
  weight_kg: number
  height_cm?: number
  bmi?: number
  notes?: string
  created_at: string
}