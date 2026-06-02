import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutsApi } from "@gymtracker/api-client";
import { queryKeys, STALE_TIMES } from "@gymtracker/constants";
export const useWorkouts = (filters) => useQuery({
    queryKey: [...queryKeys.workouts.all(), filters],
    queryFn: () => workoutsApi.getAll(filters).then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
});
export const useWorkout = (id) => useQuery({
    queryKey: queryKeys.workouts.detail((id)),
    queryFn: () => workoutsApi.getById(id).then((r) => r.data),
    staleTime: STALE_TIMES.workouts,
    enabled: !!id,
});
export const useCreateWorkout = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => workoutsApi.create(data).then((r) => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.workouts.all() }),
    });
};
export const useUpdateWorkout = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => workoutsApi.update(id, data).then((r) => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.workouts.all() }),
    });
};
export const useDeleteWorkout = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => workoutsApi.delete(id).then((r) => r.data),
        onSuccess: () => qc.invalidateQueries({
            queryKey: queryKeys.workouts.all()
        }),
    });
};
