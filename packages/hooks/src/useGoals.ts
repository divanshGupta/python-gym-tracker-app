import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsApi } from "@gymtracker/api-client";
import type {
  CreateGoalPayload,
  UpdateGoalPayload,
  LogGoalProgressPayload,
  GoalStatus,
} from "@gymtracker/types";

const goalKeys = {
  all:    ()              => ["goals"]                as const,
  byStatus: (s?: string) => ["goals", "status", s]   as const,
  detail:   (id: number) => ["goals", "detail", id]  as const,
};

// Queries
export const useGoals = (status?: string) => 
    useQuery({
        queryKey: goalKeys.byStatus(status),
        queryFn: () => goalsApi.getAll(status).then((r) => r.data),
        staleTime: 1000 * 60 * 2,
    })

export const useGoal = (id: number) => 
    useQuery({
            queryKey: goalKeys.detail(id),
            queryFn: () => goalsApi.getById(id).then((r) => r.data),
            enabled: !!id,
    })


// Mutation
export const useCreateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalPayload) => goalsApi.create(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: goalKeys.all() }),
  })
}

export const useUpdateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGoalPayload }) => goalsApi.update(id, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: goalKeys.all() }),
  })
}

export const useDeleteGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => goalsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: goalKeys.all() }),
  })
}

export const useLogGoalProgress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      goalId,
      data,
    }: {
      goalId: number;
      data: LogGoalProgressPayload;
    }) => goalsApi.logProgress(goalId, data).then((r) => r.data),
    // Invalidate all goal queries — current_value and status may have changed
    onSuccess: () => qc.invalidateQueries({ queryKey: goalKeys.all() }),
  });
};