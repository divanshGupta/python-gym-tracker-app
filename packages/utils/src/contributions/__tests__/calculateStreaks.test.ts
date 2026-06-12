import { calculateStreaks } from "../streaks";
import type { ContributionDay } from "../types";

// ---------- Helpers --------------

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

// ---------- Tests --------------

describe("calculateStreaks", () => {
  it("maintains current streak when today has no workout yet (grace day)", () => {
    const contributions: ContributionDay[] = [
      { date: daysAgo(1), count: 1 },
      { date: daysAgo(0), count: 0 },
    ];
    const result = calculateStreaks(contributions);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it("returns zero streaks when there are no contributions", () => {
    // arrange
    const emptyDays: ContributionDay[] = [];

    // act
    const result = calculateStreaks(emptyDays);

    // assert
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });

  it("calculates the correct current and longest streaks", () => {
    // arrange
    const contributions: ContributionDay[] = [
      { date: "2024-06-01", count: 1 },
      { date: "2024-06-02", count: 1 },
      { date: "2024-06-03", count: 1 },
      { date: "2024-06-04", count: 0 },
    ];

    // act
    const result = calculateStreaks(contributions);

    // assert
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it("calculates correct longest and current streak with a grace day and with a break", () => {
    // arrange
    const contributions: ContributionDay[] = [
      { date: "2024-06-01", count: 1 },
      { date: "2024-06-02", count: 1 },
      { date: "2024-06-03", count: 1 },
      { date: "2024-06-04", count: 0 },
      { date: "2024-06-05", count: 1 },
      { date: "2024-06-06", count: 0 },
    ];
    // act
    const result = calculateStreaks(contributions);
    // asssert
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(3);
  });

  it("handles a single day of contributions with non-zero count", () => {
    // arrange
    const contributions: ContributionDay[] = [{ date: "2024-06-01", count: 5 }];

    // act
    const result = calculateStreaks(contributions);

    // assert
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it("handles a single day of zero contributions with no previous streak", () => {
    // arrange
    const contributions: ContributionDay[] = [{ date: "2024-06-01", count: 0 }];

    // act
    const result = calculateStreaks(contributions);

    // assert
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });

  it("handles a single day of zero contributions with an ongoing streak", () => {
    // arrange
    const contributions: ContributionDay[] = [
      { date: "2024-06-01", count: 0 },
      { date: "2024-06-02", count: 5 },
    ];

    // act
    const result = calculateStreaks(contributions);

    // assert
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it("handles a single day of zero contributions with an ongoing streak (with grace)", () => {
    // arrange
    const contributions: ContributionDay[] = [
      { date: "2024-06-01", count: 0 },
      { date: "2024-06-02", count: 5 },
      { date: "2024-06-03", count: 0 },
    ];

    // act
    const result = calculateStreaks(contributions);

    // assert
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it("handles a single day of zero contributions with a break streak", () => {
    // arrange
    const contributions: ContributionDay[] = [
      { date: "2024-06-01", count: 5 },
      { date: "2024-06-02", count: 0 },
      { date: "2024-06-03", count: 0 },
    ];

    // act
    const result = calculateStreaks(contributions);

    // assert
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(1);
  });

  it("handles a single day of zero contributions with multiple breaks (with grace)", () => {
    // arrange
    const contributions: ContributionDay[] = [
      { date: "2024-06-01", count: 5 },
      { date: "2024-06-02", count: 0 },
      { date: "2024-06-03", count: 0 },
      { date: "2024-06-04", count: 0 },
      { date: "2024-06-05", count: 1 },
    ];

    // act
    const result = calculateStreaks(contributions);

    // assert
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it("both streak zero if all days have zero contributions", () => {
    // arrange
    const contributions: ContributionDay[] = [
      { date: "2024-06-01", count: 0 },
      { date: "2024-06-02", count: 0 },
      { date: "2024-06-03", count: 0 },
    ];

    // act
    const result = calculateStreaks(contributions);

    // assert
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });
});
