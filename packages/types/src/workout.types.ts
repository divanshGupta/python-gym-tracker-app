// Matches backend WorkoutExerciseResponse exactly
export interface WorkoutExercise {
  id:          number;
  exercise_id: number;
  sets:        number | null;
  reps:        number | null;
  weight:      number | null;
  exercise:    WorkoutExerciseDetail;
}

export interface WorkoutExerciseDetail {
  id:       number;
  name:     string;
  category: string;
}

// Matches backend WorkoutResponse exactly
export interface Workout {
  id:                number;
  user_id:           number;
  date:              string;         // "YYYY-MM-DD"
  type:              string;         // "Strength" | "Cardio" etc
  duration:          number | null;  // minutes
  calories:          number | null;
  notes:             string | null;
  workout_exercises: WorkoutExercise[];
}

// Matches backend WorkoutCreate
export interface CreateWorkoutPayload {
  date:      string;
  type:      string;
  duration?: number;
  calories?: number;
  notes?:    string;
  exercises: CreateWorkoutExercisePayload[];
}

export interface CreateWorkoutExercisePayload {
  exercise_id: number;
  sets?:       number;
  reps?:       number;
  weight?:     number;
}

export interface UpdateWorkoutPayload {
  date?:     string;
  type?:     string;
  duration?: number;
  calories?: number;
  notes?:    string;
}

export interface WorkoutFilters {
  page?:      number;
  limit?:     number;
  type?:      string;
  date_from?: string;
  date_to?:   string;
}

// old types
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

export interface StreakData {
  current_streak: number
  longest_streak: number
  last_workout: string | null
}

export interface ProgressPoint {
  date: string
  max_weight: number
}

export interface VolumePoint {
  date: string
  volume: number
}

export interface ExerciseProgress {
  exercise_id: number
  max_weight_over_time: ProgressPoint[]
  volume_over_time: VolumePoint[]
}