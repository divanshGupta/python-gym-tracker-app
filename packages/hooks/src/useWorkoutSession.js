import { useWorkoutSessionStore } from "@gymtracker/stores";
import { useCreateWorkout } from "./useWorkouts";
// Combines the local session store with the API mutation.
// This is the single hook LogWorkoutScreen needs —/;.l,k m
// it never touches the store or API directly.
export const useWorkoutSession = () => {
    const store = useWorkoutSessionStore();
    const createWorkout = useCreateWorkout();
    const finishSession = async () => {
        const payload = {
            date: new Date().toISOString().split("T")[0], // "YYYY-MM-DD"
            type: store.workoutName, // maps to workout type
            exercises: store.activeExercises.map((ae) => ({
                exercise_id: ae.exercise.id,
                sets: ae.sets.filter((s) => s.completed && s.reps !== "" && s.weight !== "")
                    .length || undefined,
                reps: ae.sets[0]?.reps ? parseInt(ae.sets[0].reps, 10) : undefined,
                weight: ae.sets[0]?.weight ? parseFloat(ae.sets[0].weight) : undefined,
            })),
        };
        await createWorkout.mutateAsync(payload);
        store.cancelSession();
    };
    return {
        isActive: store.isActive,
        workoutName: store.workoutName,
        startedAt: store.startedAt,
        activeExercises: store.activeExercises,
        completedSetCount: store.completedSetCount,
        totalVolume: store.totalVolume,
        startSession: store.startSession,
        cancelSession: store.cancelSession,
        addExercise: store.addExercise,
        removeExercise: store.removeExercise,
        addSet: store.addSet,
        removeSet: store.removeSet,
        updateSet: store.updateSet,
        toggleSet: store.toggleSet,
        updateNotes: store.updateNotes,
        finishSession,
        isSaving: createWorkout.isPending,
        saveError: createWorkout.error,
    };
};
