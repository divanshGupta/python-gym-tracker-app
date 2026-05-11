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