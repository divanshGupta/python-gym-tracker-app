import { create } from "zustand";
import { exercisesApi } from "@gymtracker/api-client";
import type { Exercise, ExerciseCategory } from "@gymtracker/types";

// ─── State interface ───────────────────────────────────────────────────────

interface ExerciseState {
  // Data
  exercises:   Exercise[];

  // Flags
  isLoading:   boolean;
  error:       string | null;

  // Actions
  fetchExercises:   (category?: ExerciseCategory) => Promise<void>;
  clearError:       () => void;
}

// ─── Store ─────────────────────────────────────────────────────────────────
// Exercises are reference data — fetched once, rarely change.
// Both mobile and web use this same store via @gymtracker/stores.

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises:   [],
  isLoading:   false,
  error:       null,

  fetchExercises: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await exercisesApi.getAll(category);
      set({ exercises: data, isLoading: false });
    } catch (e: any) {
      set({
        error:     e.response?.data?.detail ?? "Failed to load exercises",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));