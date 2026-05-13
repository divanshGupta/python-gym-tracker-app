import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { measurementsApi } from "@gymtracker/api-client"; 
import type { Measurement, CreateMeasurementPayload } from "@gymtracker/types";
import { queryKeys, STALE_TIMES } from "@gymtracker/constants";


// Queries
export function useMeasurements() {
  return useQuery({
    queryKey: queryKeys.measurements.all(),
    queryFn: measurementsApi.getAll,
  })
}

// Mutations
export function useLogMeasurement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: measurementsApi.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.measurements.all(),
      })
    },
  })
}