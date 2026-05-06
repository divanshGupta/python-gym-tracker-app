export type MuscleGroup =
  | "chest" | "back" | "legs" | "arms" | "shoulders" | "core" | "cardio";

export type Equipment =
  | "barbell" | "dumbbell" | "bodyweight" | "machine" | "cable" | "kettlebell";

export type ExerciseType = "compound" | "isolation" | "isometric" | "cardio";

export interface Exercise {
  id: string;
  name: string;
  muscle_group: MuscleGroup;
  equipment: Equipment;
  type: ExerciseType;
  description?: string;
}