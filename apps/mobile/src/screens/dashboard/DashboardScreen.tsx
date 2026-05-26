import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// shared packages 
import { useAuthStore }  from "@gymtracker/stores";
import { useWorkouts }   from "@gymtracker/hooks";
import type { Workout }  from "@gymtracker/types";

// Local components (mobile-only UI — stays in mobile app) 
import { StreakCard }         from "../../components/dashboard/StreakCard";
import { StatCard }           from "../../components/dashboard/StatCard";
import { RecentWorkoutItem }  from "../../components/dashboard/RecentWorkoutItem";
import { tokens }             from "../../theme/tokens";

// Helpers
const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatVolume = (kg: number): string =>
  kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${Math.round(kg)}`;

// Screen
export const DashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // Auth — from Zustand (local state, already in memory)
  const { user } = useAuthStore();

  // ── Workouts — from React Query (server state, auto-fetched + cached) ────
  // data:     the workouts array (defaults to [] while loading)
  // isLoading: true only on the very first fetch (no cached data yet)
  // isRefetching: true on background refresh (cached data already shown)
  // refetch:  call manually to trigger a refresh

  const {
    data: workouts = [],
    isLoading,
    isRefetching,
    refetch,
  } = useWorkouts();

  // Derived values — computed from the cached workouts array

  const thisMonthCount = workouts.filter((w: Workout) => {
    const d   = new Date(w.date);
    const now = new Date();
    return (
      d.getMonth()    === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const totalKg = workouts.reduce((acc, w) =>
    acc + (w.workout_exercises ?? []).reduce((eAcc, e) =>
      eAcc + (e.sets ?? 0) * (e.reps ?? 0) * (e.weight ?? 0), 0), 0);

  const recentWorkouts = [...workouts]
    .sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 3);

  // Render

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          // isRefetching shows the spinner during pull-to-refresh
          // isLoading would hide the list entirely on first load — wrong here
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}          // refetch comes directly from useWorkouts
            tintColor={tokens.colors.accent}
          />
        }
      >
        {/* ── Header ───────────────────────────────────────────────────── */}
        <View className="px-5 pb-4" style={{ paddingTop: insets.top + 12 }}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-text-secondary text-sm">
                {getGreeting()}
              </Text>
              <Text className="text-text-primary text-xl font-semibold mt-0.5">
                {user?.username ?? "Athlete"} 👋
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-accent items-center justify-center"
              onPress={() => navigation.navigate("Profile")}
            >
              <Text className="text-white font-semibold text-base">
                {user?.username?.[0]?.toUpperCase() ?? "A"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 gap-3">

          {/* ── Streak card ──────────────────────────────────────────────── */}
          <StreakCard workouts={workouts} />

          {/* ── Stat cards ───────────────────────────────────────────────── */}
          <View className="flex-row gap-3">
            <StatCard
              value={thisMonthCount.toString()}
              label="Workouts this month"
            />
            <StatCard
              value={formatVolume(totalKg)}
              label="Total kg lifted"
            />
          </View>

          {/* ── Recent workouts ──────────────────────────────────────────── */}
          <View className="mt-1">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-text-secondary text-2xs font-medium uppercase tracking-wide">
                Recent workouts
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text className="text-accent text-xs">See all</Text>
              </TouchableOpacity>
            </View>

            {/* First load — no cached data yet, show full spinner */}
            {isLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator color={tokens.colors.accent} />
              </View>

            /* Loaded but empty */
            ) : recentWorkouts.length === 0 ? (
              <View className="bg-surface rounded-md p-6 items-center border border-border-default">
                <Text className="text-text-secondary text-sm text-center">
                  No workouts yet.{"\n"}Tap + to log your first session.
                </Text>
              </View>

            /* Has data */
            ) : (
              <View className="bg-surface rounded-md border border-border-default overflow-hidden">
                {recentWorkouts.map((w, i) => (
                  <RecentWorkoutItem
                    key={w.id}
                    workout={w}
                    isLast={i === recentWorkouts.length - 1}
                    onPress={() =>
                      navigation.navigate("WorkoutDetail", { workoutId: w.id })
                    }
                  />
                ))}
              </View>
            )}
          </View>

        </View>
      </ScrollView>

      {/* ── FAB ────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        className="absolute right-5 w-14 h-14 bg-accent rounded-xl items-center justify-center"
        style={{ bottom: insets.bottom + 16 }}
        onPress={() => navigation.navigate("Log")}
        activeOpacity={0.85}
      >
        <Text className="text-white text-2xl font-light">+</Text>
      </TouchableOpacity>
    </View>
  );
};