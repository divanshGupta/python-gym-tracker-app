import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { workoutsApi }                from "@gymtracker/api-client";
import { queryKeys, STALE_TIMES }     from "@gymtracker/constants";
import type { CreateWorkoutPayload }  from "@gymtracker/types";

// Fetch all workouts for the current user
export const useWorkouts = () =>
  useQuery({
    queryKey: queryKeys.workouts.all(),
    queryFn:  () => workoutsApi.getAll().then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
  });

// Fetch a single workout by id
export const useWorkout = (id: string) =>
  useQuery({
    queryKey: queryKeys.workouts.detail(id),
    queryFn:  () => workoutsApi.getById(id).then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
    enabled:   !!id,
  });

// Create a new workout — invalidates list cache on success
export const useCreateWorkout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkoutPayload) =>
      workoutsApi.create(data).then((r) => r.data),
    onSuccess: () => {
      // Both web and mobile caches are invalidated — next render refetches
      qc.invalidateQueries({ queryKey: queryKeys.workouts.all() });
    },
  });
};

// Delete a workout — optimistically removes from list cache
export const useDeleteWorkout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      workoutsApi.delete(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workouts.all() });
    },
  });
};