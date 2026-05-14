import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { measurementsApi } from "@gymtracker/api-client";
import { queryKeys } from "@gymtracker/constants";

export const useMeasurements = () =>
  useQuery({
    queryKey: queryKeys.measurements.all(),
    // ← unwrap .data — was missing, causing type mismatch
    queryFn:  () => measurementsApi.getAll().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  });

export const useLogMeasurement = () => {
  const qc = useQueryClient();
  return useMutation({
    // ← unwrap .data
    mutationFn: (data: Parameters<typeof measurementsApi.create>[0]) =>
      measurementsApi.create(data).then((r) => r.data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.measurements.all() }),
  });
};

export const useDeleteMeasurement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => measurementsApi.delete(id),
    onSuccess:  () =>
      qc.invalidateQueries({ queryKey: queryKeys.measurements.all() }),
  });
};