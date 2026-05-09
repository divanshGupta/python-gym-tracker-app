export interface Set {
  id: string;
  reps: number;
  weight: number;
  unit: "kg" | "lbs";
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exercise_id: string;
  exercise_name: string;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  started_at: string;
  completed_at?: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface CreateWorkoutPayload {
  name: string;
  exercises?: Omit<WorkoutExercise, "id">[];
  notes?: string;
  completed_at?: string;
}