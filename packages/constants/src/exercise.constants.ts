// Match your FastAPI backend enums exactly
// These are the 4 categories your backend has seeded

export const EXERCISE_CATEGORIES = [
  { value: "strength",    label: "Strength"    },
  { value: "cardio",      label: "Cardio"      },
  { value: "flexibility", label: "Flexibility" },
  { value: "core",        label: "Core"        },
] as const;

export type ExerciseCategoryValue =
  typeof EXERCISE_CATEGORIES[number]["value"];
// → "strength" | "cardio" | "flexibility" | "core"


export const MUSCLE_GROUPS = [
  { value: "chest",     label: "Chest"     },
  { value: "back",      label: "Back"      },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms",      label: "Arms"      },
  { value: "legs",      label: "Legs"      },
  { value: "core",      label: "Core"      },
  { value: "full_body", label: "Full Body" },
] as const;

export type MuscleGroupValue =
  typeof MUSCLE_GROUPS[number]["value"];
// → "chest" | "back" | "shoulders" | "arms" | "legs" | "core" | "full_body"


export const EQUIPMENT_LIST = [
  { value: "barbell",     label: "Barbell"     },
  { value: "dumbbell",    label: "Dumbbell"    },
  { value: "bodyweight",  label: "Bodyweight"  },
  { value: "machine",     label: "Machine"     },
  { value: "cable",       label: "Cable"       },
  { value: "kettlebell",  label: "Kettlebell"  },
  { value: "none",        label: "None"        },
] as const;

export type EquipmentValue =
  typeof EQUIPMENT_LIST[number]["value"];


// Muscle group → UI color config
// Used by both web and mobile (hex values, no Tailwind classes)
export const MUSCLE_GROUP_COLORS: Record<MuscleGroupValue, { bg: string; text: string; dot: string }> = {
  chest:     { bg: "#2C1F5E", text: "#9B7EFD", dot: "#7C5CFC" },
  back:      { bg: "#1A2E1A", text: "#4ADE80", dot: "#22C55E" },
  legs:      { bg: "#2A2010", text: "#FCD34D", dot: "#F59E0B" },
  arms:      { bg: "#2E1A22", text: "#F472B6", dot: "#EC4899" },
  shoulders: { bg: "#1A2030", text: "#60A5FA", dot: "#3B82F6" },
  core:      { bg: "#1C1C2E", text: "#8E8E93", dot: "#636366" },
  full_body: { bg: "#1C2A1C", text: "#86EFAC", dot: "#4ADE80" },
};

// Category → UI color config
export const CATEGORY_COLORS: Record<ExerciseCategoryValue, { bg: string; text: string }> = {
  strength:    { bg: "#2C1F5E", text: "#9B7EFD" },
  cardio:      { bg: "#2E1A1A", text: "#FCA5A5" },
  flexibility: { bg: "#1A2030", text: "#60A5FA" },
  core:        { bg: "#1C1C2E", text: "#8E8E93" },
};