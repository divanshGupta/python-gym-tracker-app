// packages/hooks/src/useExercise.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { exercisesApi } from "@gymtracker/api-client";
import { queryKeys, STALE_TIMES } from "@gymtracker/constants";
// Fetch all exercises — optionally filtered by category
// Cached for 10 min because exercises are reference data that rarely change
export const useExercises = (category) => useQuery({
    queryKey: category
        ? queryKeys.exercises.byCategory(category)
        : queryKeys.exercises.all(),
    queryFn: () => exercisesApi.getAll(category).then((r) => r.data),
    staleTime: STALE_TIMES.exercises,
});
// Fetch a single exercise by id
export const useExercise = (id) => useQuery({
    queryKey: queryKeys.exercises.detail(id),
    queryFn: () => exercisesApi.getById(id).then((r) => r.data),
    staleTime: STALE_TIMES.exercises,
    enabled: !!id, // don't fire if id is empty string
});
// Create exercise
export const useCreateExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => exercisesApi.create(data).then((r) => r.data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.exercises.all(),
            });
        },
    });
};
