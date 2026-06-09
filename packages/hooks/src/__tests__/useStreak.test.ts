// packages/hooks/src/__tests__/useStreak.test.ts
import type { ContributionsResponse } from "@gymtracker/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { useStreak } from "../useStreak";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

// Builds a date string N days ago from today — "YYYY-MM-DD"
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useStreak", () => {
  it("returns zero streaks when there are no contributions", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // Seed empty contributions — the cache key must match
    // queryKeys.stats.contributions("yearly") exactly
    const emptyContributions: ContributionsResponse = {
      source: "workouts",
      from: daysAgo(365),
      to: daysAgo(0),
      contributions: [],
    };

    queryClient.setQueryData(
      ["stats", "contributions", "yearly"],
      emptyContributions,
    );

    const { result } = renderHook(() => useStreak(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.currentStreak).toBe(0);
    expect(result.current.longestStreak).toBe(0);
  });

  it("returns correct streak for consecutive workout days", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // Simulate 3 consecutive days of workouts ending today
    const contributions: ContributionsResponse = {
      source: "workouts",
      from: daysAgo(365),
      to: daysAgo(0),
      contributions: [
        { date: daysAgo(2), count: 1 },
        { date: daysAgo(1), count: 1 },
        { date: daysAgo(0), count: 2 },
      ],
    };

    queryClient.setQueryData(
      ["stats", "contributions", "yearly"],
      contributions,
    );

    const { result } = renderHook(() => useStreak(), {
      wrapper: makeWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // 3 consecutive days → currentStreak should be 3
    expect(result.current.currentStreak).toBe(3);
    expect(result.current.longestStreak).toBeGreaterThanOrEqual(3);
  });

  it("returns loading state when cache is empty", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // No data seeded — hook should be in loading state
    const { result } = renderHook(() => useStreak(), {
      wrapper: makeWrapper(queryClient),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.currentStreak).toBe(0);
    expect(result.current.longestStreak).toBe(0);
  });
});
