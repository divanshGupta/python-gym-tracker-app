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