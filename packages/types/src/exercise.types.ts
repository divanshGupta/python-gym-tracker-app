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
  id: number;
  name: string;
  category: ExerciseCategory;   // ← matches backend enum
  muscle_group: MuscleGroup;
  equipment: Equipment;
  description?: string;
  is_custom: boolean;
  created_by?: number;          // user id if custom
}