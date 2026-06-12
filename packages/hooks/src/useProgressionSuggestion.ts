// packages/hooks/src/useProgressionSuggestion.ts
import { statsApi } from "@gymtracker/api-client";
import { useQuery } from "@tanstack/react-query";

export const useProgressionSuggestion = (exerciseId: number) =>
  useQuery({
    queryKey: ["suggestions", exerciseId],
    queryFn: () =>
      statsApi.getProgressionSuggestion(exerciseId).then((r) => r.data),
    enabled: !!exerciseId,
    staleTime: 0,
    // staleTime: 5 * 60 * 1000,
  });
