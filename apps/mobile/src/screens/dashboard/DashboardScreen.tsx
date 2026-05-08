import React, { useEffect, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@gymtracker/stores"; 
import { useWorkoutSessionStore } from "@gymtracker/stores";
import { useWorkouts } from "@gymtracker/hooks";
import { StreakCard } from "../../components/dashboard/StreakCard";
import { StatCard } from "../../components/dashboard/StatCard";
import { RecentWorkoutItem } from "../../components/dashboard/RecentWorkoutItem";
import { ProfileScreen } from "../profile/ProfileScreen";
import { tokens } from "../../theme/tokens";
import { format } from "date-fns";

export const DashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { data: workouts = [], isLoading } = useWorkouts();

  // const onRefresh = useCallback(() => { fetchWorkouts(); }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const thisMonthCount = workouts.filter((w) => {
    const d = new Date(w.started_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const totalKg = workouts.reduce((acc, w) => {
    return acc + w.exercises.reduce((eAcc, e) => {
      return eAcc + e.sets.reduce((sAcc, s) => sAcc + s.weight * s.reps, 0);
    }, 0);
  }, 0);

  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, 3);

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={tokens.colors.accent}
          />
        }
      >
        {/* Header */}
        <View
          className="px-5 pb-4"
          style={{ paddingTop: insets.top + 12 }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-text-secondary text-sm">{greeting()}</Text>
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
          {/* Streak card */}
          <StreakCard workouts={workouts} />

          {/* Stat cards */}
          <View className="flex-row gap-3">
            <StatCard
              value={thisMonthCount.toString()}
              label="Workouts this month"
            />
            <StatCard
              value={totalKg >= 1000
                ? `${(totalKg / 1000).toFixed(1)}t`
                : `${Math.round(totalKg)}`}
              label="Total kg lifted"
            />
          </View>

          {/* Recent workouts */}
          <View className="mt-1">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-text-secondary text-2xs font-medium uppercase tracking-wide">
                Recent workouts
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text className="text-accent text-xs">See all</Text>
              </TouchableOpacity>
            </View>

            {isLoading && workouts.length === 0 ? (
              <View className="items-center py-8">
                <ActivityIndicator color={tokens.colors.accent} />
              </View>
            ) : recentWorkouts.length === 0 ? (
              <View className="bg-surface rounded-md p-6 items-center border border-border-default">
                <Text className="text-text-secondary text-sm text-center">
                  No workouts yet.{"\n"}Tap + to log your first session.
                </Text>
              </View>
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

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-8 right-5 w-14 h-14 bg-accent rounded-xl items-center justify-center"
        style={{ bottom: insets.bottom + 16 }}
        onPress={() => navigation.navigate("Log")}
        activeOpacity={0.85}
      >
        <Text className="text-white text-2xl font-light">+</Text>
      </TouchableOpacity>
    </View>
  );
};