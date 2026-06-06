// packages/stores/src/workout.store.ts
import type { WeightUnit } from "@gymtracker/constants";
import type { Exercise } from "@gymtracker/types";
import { create } from "zustand";

// Local session types
// these only exist in memory during as active workout
// they use string fields for reps/weight coz they bind to textInput

export interface ActiveSet {
  id: string; // local only uuid, never sent to api
  reps: string; // string for textInput - parsed on finish
  weight: string;
  unit: WeightUnit;
  completed: boolean;
}

export interface ActiveExercise {
  localId: string; // local only, never sent to api
  exercise: Exercise;
  sets: ActiveSet[];
  notes: string;
}

// state interface

interface WorkoutSessionState {
  // session
  isActive: boolean;
  workoutName: string;
  startedAt: Date | null;
  activeExercises: ActiveExercise[];

  // actions =- sesion lifecycle
  startSession: (name: string) => void;
  cancelSession: () => void;

  // actions - exercise
  addExercise: (exercise: Exercise) => void;
  removeExercise: (localId: string) => void;

  // Actions — sets
  addSet: (localId: string) => void;
  removeSet: (localId: string, setId: string) => void;
  updateSet: (
    localId: string,
    setId: string,
    field: "reps" | "weight",
    value: string,
  ) => void;
  toggleSet: (localId: string, setId: string) => void;
  updateNotes: (localId: string, notes: string) => void;

  // Derived helpers
  completedSetCount: () => number;
  totalVolume: () => number;
}

// ----------- Helpers -----------------

const uid = () => Math.random().toString(36).slice(2, 9);

const makeSet = (unit: WeightUnit = "kg"): ActiveSet => ({
  id: uid(),
  reps: "",
  weight: "",
  unit,
  completed: false,
});

const resetState = {
  isActive: false,
  workoutName: "",
  startedAt: null,
  activeExercises: [],
};

// --------------- STORE ----------------------
// Note: This store handles LOCAL session state only.
// Persisting to the API is done via the useCreateWorkout hook (React Query)
// in the LogWorkoutScreen — keeping the store pure and testable.

export const useWorkoutSessionStore = create<WorkoutSessionState>(
  (set, get) => ({
    ...resetState,

    // ── Session lifecycle ───────────────────────────────────────────────────
    startSession: (name) =>
      set({
        isActive: true,
        workoutName: name,
        startedAt: new Date(),
        activeExercises: [],
      }),

    cancelSession: () => set(resetState),

    // ── Exercises ───────────────────────────────────────────────────────────
    addExercise: (exercise) =>
      set((s) => ({
        activeExercises: [
          ...s.activeExercises,
          { localId: uid(), exercise, sets: [makeSet()], notes: "" },
        ],
      })),

    removeExercise: (localId) =>
      set((s) => ({
        activeExercises: s.activeExercises.filter((e) => e.localId !== localId),
      })),

    // ── Sets ────────────────────────────────────────────────────────────────
    addSet: (localId) =>
      set((s) => ({
        activeExercises: s.activeExercises.map((e) =>
          e.localId === localId
            ? { ...e, sets: [...e.sets, makeSet(e.sets[0]?.unit ?? "kg")] }
            : e,
        ),
      })),

    removeSet: (localId, setId) =>
      set((s) => ({
        activeExercises: s.activeExercises.map((e) =>
          e.localId === localId
            ? { ...e, sets: e.sets.filter((s) => s.id !== setId) }
            : e,
        ),
      })),

    updateSet: (localId, setId, field, value) =>
      set((s) => ({
        activeExercises: s.activeExercises.map((e) =>
          e.localId === localId
            ? {
                ...e,
                sets: e.sets.map((sv) =>
                  sv.id === setId ? { ...sv, [field]: value } : sv,
                ),
              }
            : e,
        ),
      })),

    toggleSet: (localId, setId) =>
      set((s) => ({
        activeExercises: s.activeExercises.map((e) =>
          e.localId === localId
            ? {
                ...e,
                sets: e.sets.map((sv) =>
                  sv.id === setId ? { ...sv, completed: !sv.completed } : sv,
                ),
              }
            : e,
        ),
      })),

    updateNotes: (localId, notes) =>
      set((s) => ({
        activeExercises: s.activeExercises.map((e) =>
          e.localId === localId ? { ...e, notes } : e,
        ),
      })),

    // ── Derived ─────────────────────────────────────────────────────────────
    completedSetCount: () =>
      get().activeExercises.reduce(
        (acc, e) => acc + e.sets.filter((s) => s.completed).length,
        0,
      ),

    totalVolume: () =>
      get().activeExercises.reduce(
        (acc, e) =>
          acc +
          e.sets
            .filter((s) => s.completed && s.reps && s.weight)
            .reduce(
              (sAcc, s) => sAcc + parseFloat(s.weight) * parseInt(s.reps),
              0,
            ),
        0,
      ),
  }),
);
