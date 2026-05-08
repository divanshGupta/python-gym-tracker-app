export interface WorkoutSet {
  id: number;
  reps: number;
  weight: number;
  unit: "kg" | "lbs";
  completed: boolean;
  rest_seconds?: number;
}

export interface WorkoutExercise {
  id: number;
  exercise_id: string;
  exercise_name: string;
  muscle_group: string;
  sets: WorkoutSet[];
  notes?: string;
  order: number;
}

export interface Workout {
  id: number;
  name: string;
  user_id: string;
  started_at: string;           // ISO string
  completed_at?: string;
  exercises: WorkoutExercise[];
  notes?: string;
  total_volume?: number;        // computed by backend
}

export interface CreateSetPayload {
  reps:         number;
  weight:       number;
  unit:         "kg" | "lbs";
  completed:    boolean;
  rest_seconds?: number;
}

export interface CreateExercisePayload {
  exercise_id:   number;
  exercise_name: string;
  muscle_group:  string;
  sets:          CreateSetPayload[];
  notes?:        string;
  order:         number;
}

export interface CreateWorkoutPayload {
  name:          string;
  exercises:     CreateExercisePayload[];
  notes?:        string;
  completed_at?: string;
}
