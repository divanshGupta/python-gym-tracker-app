import type {
  ExerciseCategoryValue,
  MuscleGroupValue,
  EquipmentValue,
} from "@gymtracker/constants";

// Match your FastAPI backend exactly
// Re-export for convenience — consumers can import types from one place
export type ExerciseCategory = ExerciseCategoryValue;
export type MuscleGroup      = MuscleGroupValue;
export type Equipment        = EquipmentValue;

export interface Exercise {
  id:            number;
  name:          string;
  category:      string;
  muscle_group:  string | null;   // null for cardio/flexibility exercises
  equipment:     string;
  description?:  string | null;
  created_by?: number;          // user id if custom
}

export interface CreateExercisePayload {
  name:          string;
  category:      string;
  muscle_group?: string | null;   // optional
  equipment?:    string | null;   // optional
  description?:  string | null;
}