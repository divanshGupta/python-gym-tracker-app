import React from "react";
import { View, Text } from "react-native";
import { startOfDay, subDays, isSameDay } from "date-fns";
import type { Workout } from "@gymtracker/types";
import { tokens } from "../../theme/tokens";
import { AppCard } from "../ui";

interface Props { workouts: Workout[]; }

const computeStreak = (workouts: Workout[]): number => {
  if (!workouts.length) return 0;
  const workoutDays = new Set(
    workouts.map((w) => startOfDay(new Date(w.date)).getTime())
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
  const today  = startOfDay(new Date());
  const last7  = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

  const workoutDaySet = new Set(
    workouts.map((w) => startOfDay(new Date(w.date)).getTime())
  );

  return (
    <AppCard className="px-4 py-3.5">
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-2xs font-semibold text-text-secondary uppercase tracking-wider">
          Current streak
        </Text>
        {streak >= 3 && (
          <Text className="text-xs font-semibold text-accent">
            🔥 {streak} days strong
          </Text>
        )}
        {streak === 0 && (
          <Text className="text-xs text-text-tertiary">
            Log a workout to start
          </Text>
        )}
      </View>

      {/* Content row */}
      <View className="flex-row items-center">
        {/* Streak number */}
        <View style={{ width: 56 }}>
          <Text className="text-3xl font-bold text-accent tracking-tighter leading-8">
            {streak}
          </Text>
          <Text className="text-2xs text-text-secondary font-medium uppercase tracking-wide mt-0.5">
            days
          </Text>
        </View>

        {/* Dots + labels */}
        <View className="flex-1">
          <View className="flex-row justify-between">
            {last7.map((day, i) => {
              const isToday = isSameDay(day, today);
              const done    = workoutDaySet.has(day.getTime());
              return (
                <View
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    backgroundColor: done ? tokens.colors.accent : tokens.colors.elevated,
                    borderWidth: isToday ? 1.5 : 0,
                    borderColor: tokens.colors.accent,
                  }}
                />
              );
            })}
          </View>

          <View className="flex-row justify-between mt-1.5">
            {last7.map((day, i) => {
              const isToday  = isSameDay(day, today);
              const dayIndex = (day.getDay() + 6) % 7;
              return (
                <Text
                  key={i}
                  style={{
                    width: 28,
                    textAlign: "center",
                    fontWeight: isToday ? "700" : "500",
                    color: isToday ? tokens.colors.accent : tokens.colors.textTertiary,
                  }}
                  className="text-2xs"
                >
                  {DAYS[dayIndex]}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    </AppCard>
  );
};