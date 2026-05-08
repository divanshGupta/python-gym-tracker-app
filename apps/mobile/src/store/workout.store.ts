import { create } from "zustand";
import { workoutsApi } from "../../../../old/api/workouts.api";
import type { Workout, CreateWorkoutPayload } from "../types/workout.types";
import type { Exercise } from "../types/exercise.types";

export interface ActiveSet {
  id: string;        // local uuid
  reps: string;      // string for TextInput
  weight: string;
  completed: boolean;
}

export interface ActiveExercise {
  localId: string;
  exercise: Exercise;
  sets: ActiveSet[];
}

interface WorkoutState {
  workouts: Workout[];
  isLoading: boolean;

  // active session — local state, not yet saved
  activeWorkoutName: string;
  activeExercises: ActiveExercise[];
  sessionStartTime: Date | null;

  fetchWorkouts: () => Promise<void>;
  startSession: (name: string) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (localId: string) => void;
  addSet: (localId: string) => void;
  removeSet: (localId: string, setId: string) => void;
  updateSet: (localId: string, setId: string, field: "reps" | "weight", value: string) => void;
  toggleSet: (localId: string, setId: string) => void;
  finishSession: () => Promise<void>;
  cancelSession: () => void;
}

const makeSet = (): ActiveSet => ({
  id: Math.random().toString(36).slice(2),
  reps: "",
  weight: "",
  completed: false,
})

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  isLoading: false,
  activeWorkoutName: "",
  activeExercises: [],
  sessionStartTime: null,

  fetchWorkouts: async () => {
    set({ isLoading: true });
    try {
      const { data } = await workoutsApi.getAll();
      set({ workouts: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  startSession: (name) => set({
    activeWorkoutName: name,
    activeExercises: [],
    sessionStartTime: new Date(),
  }),

  addExercise: (exercise) => set((s) => ({
    activeExercises: [
      ...s.activeExercises,
      { localId: Math.random().toString(36).slice(2), exercise, sets: [makeSet()] },
    ],
  })),

  removeExercise: (localId) => set((s) => ({
    activeExercises: s.activeExercises.filter((e) => e.localId !== localId),
  })),

  addSet: (localId) => set((s) => ({
    activeExercises: s.activeExercises.map((e) =>
      e.localId === localId ? { ...e, sets: [...e.sets, makeSet()] } : e
    ),
  })),

  removeSet: (localId, setId) => set((s) => ({
    activeExercises: s.activeExercises.map((e) =>
      e.localId === localId
        ? { ...e, sets: e.sets.filter((s) => s.id !== setId) }
        : e
    ),
  })),

  updateSet: (localId, setId, field, value) => set((s) => ({
    activeExercises: s.activeExercises.map((e) =>
      e.localId === localId
        ? { ...e, sets: e.sets.map((s) => s.id === setId ? { ...s, [field]: value } : s) }
        : e
    ),
  })),

  toggleSet: (localId, setId) => set((s) => ({
    activeExercises: s.activeExercises.map((e) =>
      e.localId === localId
        ? { ...e, sets: e.sets.map((sv) => sv.id === setId ? { ...sv, completed: !sv.completed } : sv) }
        : e
    ),
  })),

  finishSession: async () => {
    const { activeWorkoutName, activeExercises, sessionStartTime } = get();
    const payload: CreateWorkoutPayload = {
      name: activeWorkoutName,
      completed_at: new Date().toISOString(),
      exercises: activeExercises.map((e) => ({
        exercise_id: e.exercise.id,
        exercise_name: e.exercise.name,
        sets: e.sets
          .filter((s) => s.completed && s.reps && s.weight)
          .map((s) => ({
            reps: parseInt(s.reps),
            weight: parseFloat(s.weight),
            unit: "kg" as const,
            completed: true,
          })),
        notes: "",
      })),
    };
    await workoutsApi.create(payload);
    set({ activeWorkoutName: "", activeExercises: [], sessionStartTime: null });
    get().fetchWorkouts();
  },

  cancelSession: () => set({
    activeWorkoutName: "", activeExercises: [], sessionStartTime: null,
  }),
}));