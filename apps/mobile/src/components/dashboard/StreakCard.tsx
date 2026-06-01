import React from "react";
import { View, Text } from "react-native";
import { startOfDay, subDays, isSameDay } from "date-fns";
import type { Workout } from "@gymtracker/types";

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
    <View className="bg-surface rounded-md border border-border-default px-4 py-3">

      {/* Header row — label + motivational text on same line */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-text-secondary text-2xs font-medium uppercase tracking-wide">
          Current streak
        </Text>
        {streak >= 3 && (
          <Text style={{ fontSize: 11, color: "#9B7EFD" }}>
            🔥 {streak} days strong
          </Text>
        )}
        {streak === 0 && (
          <Text style={{ fontSize: 11, color: "#636366" }}>
            Log a workout to start
          </Text>
        )}
      </View>

      {/* Content row — number + dots side by side */}
      <View className="flex-row items-center">
        {/* Streak number — smaller, tighter */}
        <View style={{ width: 52 }}>
          <Text style={{ fontSize: 28, fontWeight: "700",
                         color: "#7C5CFC", letterSpacing: -1, lineHeight: 30 }}>
            {streak}
          </Text>
          <Text style={{ fontSize: 10, color: "#8E8E93", marginTop: 1 }}>
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
                    width:           28,
                    height:          28,
                    borderRadius:    7,
                    backgroundColor: done ? "#7C5CFC" : "#2C2C2E",
                    borderWidth:     isToday ? 1.5 : 0,
                    borderColor:     "#9B7EFD",
                  }}
                />
              );
            })}
          </View>

          <View className="flex-row justify-between mt-1">
            {last7.map((day, i) => {
              const isToday  = isSameDay(day, today);
              const dayIndex = (day.getDay() + 6) % 7;
              return (
                <Text
                  key={i}
                  style={{
                    width:      28,
                    fontSize:   9,
                    textAlign:  "center",
                    fontWeight: "500",
                    color:      isToday ? "#9B7EFD" : "#636366",
                  }}
                >
                  {DAYS[dayIndex]}
                </Text>
              );
            })}
          </View>
        </View>
      </View>

    </View>
  );
};