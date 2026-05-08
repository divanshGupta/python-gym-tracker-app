import { useWorkoutSessionStore } from "@gymtracker/stores";
import { useCreateWorkout }       from "./useWorkouts";
import type { CreateWorkoutPayload, CreateExercisePayload } from "@gymtracker/types";

// Combines the local session store with the API mutation.
// This is the single hook LogWorkoutScreen needs —
// it never touches the store or API directly.

export const useWorkoutSession = () => {
  const store           = useWorkoutSessionStore();
  const createWorkout   = useCreateWorkout();

  const finishSession = async (): Promise<void> => {
    const payload: CreateWorkoutPayload = {
      name:         store.workoutName,
      completed_at: new Date().toISOString(),
      exercises:    store.activeExercises.map((ae, index): CreateExercisePayload => ({
        exercise_id:   ae.exercise.id,
        exercise_name: ae.exercise.name,
        muscle_group:  ae.exercise.muscle_group,
        order:         index,
        notes:         ae.notes,
        sets: ae.sets
          .filter((s) => s.completed && s.reps !== "" && s.weight !== "")
          .map((s) => ({
            reps:      parseInt(s.reps, 10),
            weight:    parseFloat(s.weight),
            unit:      s.unit,
            completed: true,
          })),
      })),
    };

    await createWorkout.mutateAsync(payload);
    store.cancelSession(); // wipe local state after successful save
  };

  return {
    // Session state
    isActive:          store.isActive,
    workoutName:       store.workoutName,
    startedAt:         store.startedAt,
    activeExercises:   store.activeExercises,

    // Derived
    completedSetCount: store.completedSetCount,
    totalVolume:       store.totalVolume,

    // Session actions
    startSession:      store.startSession,
    cancelSession:     store.cancelSession,

    // Exercise actions
    addExercise:       store.addExercise,
    removeExercise:    store.removeExercise,

    // Set actions
    addSet:            store.addSet,
    removeSet:         store.removeSet,
    updateSet:         store.updateSet,
    toggleSet:         store.toggleSet,
    updateNotes:       store.updateNotes,

    // Finish — saves to API then clears local state
    finishSession,
    isSaving:          createWorkout.isPending,
    saveError:         createWorkout.error,
  };
};