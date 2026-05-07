// Match backend enum exactly
export const EXERCISE_CATEGORIES = [
  { value: "strength",    label: "Strength"    },
  { value: "cardio",      label: "Cardio"      },
  { value: "flexibility", label: "Flexibility" },
  { value: "core",        label: "Core"        },
] as const;

export const MUSCLE_GROUPS = [
  { value: "chest",     label: "Chest"     },
  { value: "back",      label: "Back"      },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms",      label: "Arms"      },
  { value: "legs",      label: "Legs"      },
  { value: "core",      label: "Core"      },
  { value: "full_body", label: "Full Body" },
] as const;