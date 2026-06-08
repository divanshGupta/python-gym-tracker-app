// packages/hooks/src/__tests__/useWorkoutStats.test.ts
import type { WorkoutStats } from "@gymtracker/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useWorkoutStats } from "../useStats";

const mockStats: WorkoutStats = {
  total_workouts: 42,
  total_duration_minutes: 2310,
  total_calories_burned: 9800,
  workouts_by_type: { strength: 30, cardio: 12 },
  most_logged_exercise: "Bench Press",
};

function makeWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useWorkoutStats", () => {
  it("returns data that was pre-seeded into the cache", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    // Inject mock data directly — no network, no MSW needed
    queryClient.setQueryData(["stats", "summary"], mockStats);

    const { result } = renderHook(() => useWorkoutStats(), {
      wrapper: makeWrapper(queryClient),
    });

    expect(result.current.data).toEqual(mockStats);
    expect(result.current.data?.total_workouts).toBe(42);
    expect(result.current.isSuccess).toBe(true);
  });

  it("starts in loading state when cache is empty", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result } = renderHook(() => useWorkoutStats(), {
      wrapper: makeWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
