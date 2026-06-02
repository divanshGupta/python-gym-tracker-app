import { create } from "zustand";
import { exercisesApi } from "@gymtracker/api-client";
// ─── Store ─────────────────────────────────────────────────────────────────
// Exercises are reference data — fetched once, rarely change.
// Both mobile and web use this same store via @gymtracker/stores.
export const useExerciseStore = create((set) => ({
    exercises: [],
    isLoading: false,
    error: null,
    fetchExercises: async (category) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await exercisesApi.getAll(category);
            set({ exercises: data, isLoading: false });
        }
        catch (e) {
            set({
                error: e.response?.data?.detail ?? "Failed to load exercises",
                isLoading: false,
            });
        }
    },
    clearError: () => set({ error: null }),
}));
