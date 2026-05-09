import { create } from "zustand";
import { exerciseApi } from "../../../../old/api/exercise.api";
import  type { Exercise, MuscleGroup } from "../types/exercise.types"

interface ExerciseState {
    exercises: Exercise[];
    isLoading: boolean;
    fetchExercise: () => Promise<void>;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
    exercises: [],
    isLoading: false,

    fetchExercise: async () => {
        set({ isLoading: true });
        try {
            const { data } = await exerciseApi.getAll();
            set({ exercises: data, isLoading: false });
        } catch {
            set({ isLoading: false });
        }
    },

}))