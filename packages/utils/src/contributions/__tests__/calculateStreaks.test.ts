import { calculateStreaks } from "../streaks";
import type { ContributionDay } from "../types";

describe("calculateStreaks", () => {
  it("returns zero streaks when there are no contributions", () => {
    // arrange
    const emptyDays: ContributionDay[] = [];

    // act
    const result = calculateStreaks(emptyDays);

    // assert
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });
});
