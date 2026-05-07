// Match your FastAPI backend exactly
export type ExerciseCategory = "strength" | "cardio" | "flexibility" | "core";

export type MuscleGroup =
  | "chest" | "back" | "shoulders" | "arms" | "legs" | "core" | "full_body";

export type Equipment =
  | "barbell" | "dumbbell" | "bodyweight" | "machine" | "cable" | "kettlebell" | "none";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;   // ← matches backend enum
  muscle_group: MuscleGroup;
  equipment: Equipment;
  description?: string;
  is_custom: boolean;
  created_by?: string;          // user id if custom
}