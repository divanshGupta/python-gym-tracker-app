import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsApi } from "@gymtracker/api-client";
const goalKeys = {
    all: () => ["goals"],
    byStatus: (s) => ["goals", "status", s],
    detail: (id) => ["goals", "detail", id],
};
// Queries
export const useGoals = (status) => useQuery({
    queryKey: goalKeys.byStatus(status),
    queryFn: () => goalsApi.getAll(status).then((r) => r.data),
    staleTime: 1000 * 60 * 2,
});
export const useGoal = (id) => useQuery({
    queryKey: goalKeys.detail(id),
    queryFn: () => goalsApi.getById(id).then((r) => r.data),
    enabled: !!id,
});
// Mutation
export const useCreateGoal = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => goalsApi.create(data).then((r) => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: goalKeys.all() }),
    });
};
export const useUpdateGoal = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => goalsApi.update(id, data).then((r) => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: goalKeys.all() }),
    });
};
export const useDeleteGoal = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => goalsApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: goalKeys.all() }),
    });
};
export const useLogGoalProgress = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ goalId, data, }) => goalsApi.logProgress(goalId, data).then((r) => r.data),
        // Invalidate all goal queries — current_value and status may have changed
        onSuccess: () => qc.invalidateQueries({ queryKey: goalKeys.all() }),
    });
};
