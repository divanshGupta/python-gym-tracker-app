import { create } from "zustand";
// ----------- Helpers -----------------
const uid = () => Math.random().toString(36).slice(2, 9);
const makeSet = (unit = "kg") => ({
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
export const useWorkoutSessionStore = create((set, get) => ({
    ...resetState,
    // ── Session lifecycle ───────────────────────────────────────────────────
    startSession: (name) => set({ isActive: true, workoutName: name, startedAt: new Date(), activeExercises: [] }),
    cancelSession: () => set(resetState),
    // ── Exercises ───────────────────────────────────────────────────────────
    addExercise: (exercise) => set((s) => ({
        activeExercises: [
            ...s.activeExercises,
            { localId: uid(), exercise, sets: [makeSet()], notes: "" },
        ],
    })),
    removeExercise: (localId) => set((s) => ({
        activeExercises: s.activeExercises.filter((e) => e.localId !== localId),
    })),
    // ── Sets ────────────────────────────────────────────────────────────────
    addSet: (localId) => set((s) => ({
        activeExercises: s.activeExercises.map((e) => e.localId === localId
            ? { ...e, sets: [...e.sets, makeSet(e.sets[0]?.unit ?? "kg")] }
            : e),
    })),
    removeSet: (localId, setId) => set((s) => ({
        activeExercises: s.activeExercises.map((e) => e.localId === localId
            ? { ...e, sets: e.sets.filter((s) => s.id !== setId) }
            : e),
    })),
    updateSet: (localId, setId, field, value) => set((s) => ({
        activeExercises: s.activeExercises.map((e) => e.localId === localId
            ? {
                ...e,
                sets: e.sets.map((sv) => sv.id === setId ? { ...sv, [field]: value } : sv),
            }
            : e),
    })),
    toggleSet: (localId, setId) => set((s) => ({
        activeExercises: s.activeExercises.map((e) => e.localId === localId
            ? {
                ...e,
                sets: e.sets.map((sv) => sv.id === setId ? { ...sv, completed: !sv.completed } : sv),
            }
            : e),
    })),
    updateNotes: (localId, notes) => set((s) => ({
        activeExercises: s.activeExercises.map((e) => e.localId === localId ? { ...e, notes } : e),
    })),
    // ── Derived ─────────────────────────────────────────────────────────────
    completedSetCount: () => get().activeExercises.reduce((acc, e) => acc + e.sets.filter((s) => s.completed).length, 0),
    totalVolume: () => get().activeExercises.reduce((acc, e) => acc +
        e.sets
            .filter((s) => s.completed && s.reps && s.weight)
            .reduce((sAcc, s) => sAcc + parseFloat(s.weight) * parseInt(s.reps), 0), 0),
}));
