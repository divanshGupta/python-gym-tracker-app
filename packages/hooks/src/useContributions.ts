// packages/hooks/src/useContributions.ts
import { statsApi } from "@gymtracker/api-client";
import {
  CONTRIBUTION_RANGES,
  queryKeys,
  type ContributionRange,
} from "@gymtracker/constants";
import {
  getContributionDateRange,
  processContributions,
} from "@gymtracker/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useContributions(range: ContributionRange) {
  // Derive date strings from range — stable across renders
  // for same range value
  const { from, to } = useMemo(
    () => getContributionDateRange(CONTRIBUTION_RANGES[range].days),
    [range],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.stats.contributions(range),
    queryFn: () =>
      statsApi
        .getContributions({ from, to, source: "workouts" })
        .then((r) => r.data),
    staleTime: 5 * 60 * 1000, // 5 minutes — contributions don't change often
  });

  // processContributions only reruns when API data or date range changes
  const summary = useMemo(() => {
    if (!data) return null;
    return processContributions(data.contributions, from, to);
  }, [data, from, to]);

  return {
    summary,
    isLoading,
    error,
    from,
    to,
  };
}
