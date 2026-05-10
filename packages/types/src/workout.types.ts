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

// ─── Filters ───────────────────────────────────────────────────────────────
export interface WorkoutFilters {
  page?:      number;
  limit?:     number;
  type?:      string;
  date_from?: string;
  date_to?:   string;
}