import React from "react";
import { View, Text } from "react-native";
import { startOfDay, subDays, isSameDay } from "date-fns";
import type { Workout } from "@gymtracker/types"; 

interface Props { workouts: Workout[]; }

const computeStreak = (workouts: Workout[]): number => {
  if (!workouts.length) return 0;
  const workoutDays = new Set(
    workouts.map((w) => startOfDay(new Date(w.started_at)).getTime())
  );
  let streak = 0;
  let cursor = startOfDay(new Date());
  while (workoutDays.has(cursor.getTime())) {
    streak++;
    cursor = subDays(cursor, 1);
  }
  return streak;
};

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export const StreakCard = ({ workouts }: Props) => {
  const streak = computeStreak(workouts);

  // Build last-7-days dots
  const today = startOfDay(new Date());
  const last7 = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

  const workoutDaySet = new Set(
    workouts.map((w) => startOfDay(new Date(w.started_at)).getTime())
  );

  return (
    <View className="bg-surface rounded-md border border-border-default p-4">
      <Text className="text-text-secondary text-2xs font-medium uppercase tracking-wide mb-3">
        Current streak
      </Text>

      <View className="flex-row items-center gap-3">
        {/* Number */}
        <View className="mr-1">
          <Text className="text-accent text-xl font-semibold"
            style={{ fontSize: 32, letterSpacing: -1 }}>
            {streak}
          </Text>
          <Text className="text-text-secondary text-xs mt-0.5">
            days in a row
          </Text>
        </View>

        {/* Dots */}
        <View className="flex-1">
          <View className="flex-row gap-1.5">
            {last7.map((day, i) => {
              const isToday = isSameDay(day, today);
              const done = workoutDaySet.has(day.getTime());
              return (
                <View
                  key={i}
                  className="flex-1 aspect-square rounded-sm"
                  style={{
                    aspectRatio: 1,
                    borderRadius: 6,
                    backgroundColor: done ? "#7C5CFC" : "#2C2C2E",
                    borderWidth: isToday ? 1.5 : 0,
                    borderColor: "#9B7EFD",
                    maxWidth: 28,
                    height: 24,
                  }}
                />
              );
            })}
          </View>

          {/* Day labels */}
          <View className="flex-row gap-1.5 mt-1">
            {last7.map((day, i) => {
              const isToday = isSameDay(day, today);
              const dayIndex = (day.getDay() + 6) % 7; // Mon=0
              return (
                <Text
                  key={i}
                  className="flex-1 text-center"
                  style={{
                    fontSize: 9,
                    color: isToday ? "#9B7EFD" : "#636366",
                    maxWidth: 28,
                  }}
                >
                  {DAYS[dayIndex]}
                </Text>
              );
            })}
          </View>
        </View>
      </View>

      {/* Motivational line */}
      {streak === 0 && (
        <Text className="text-text-tertiary text-xs mt-3">
          Log a workout today to start your streak.
        </Text>
      )}
      {streak >= 3 && (
        <Text className="text-accent-light text-xs mt-3">
          🔥 Keep it up — {streak} days strong!
        </Text>
      )}
    </View>
  );
};