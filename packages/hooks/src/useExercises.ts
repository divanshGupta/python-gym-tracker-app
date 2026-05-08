import { useQuery }       from "@tanstack/react-query";
import { exercisesApi }   from "@gymtracker/api-client";
import { queryKeys, STALE_TIMES } from "@gymtracker/constants";
import type { ExerciseCategory }  from "@gymtracker/types";

// Fetch all exercises — optionally filtered by category
// Cached for 10 min because exercises are reference data that rarely change
export const useExercises = (category?: ExerciseCategory) =>
  useQuery({
    queryKey: category
      ? queryKeys.exercises.byCategory(category)
      : queryKeys.exercises.all(),
    queryFn:  () => exercisesApi.getAll(category).then((r) => r.data),
    staleTime: STALE_TIMES.exercises,
  });

// Fetch a single exercise by id
export const useExercise = (id: string) =>
  useQuery({
    queryKey: queryKeys.exercises.detail(id),
    queryFn:  () => exercisesApi.getById(id).then((r) => r.data),
    staleTime: STALE_TIMES.exercises,
    enabled:   !!id,   // don't fire if id is empty string
  });