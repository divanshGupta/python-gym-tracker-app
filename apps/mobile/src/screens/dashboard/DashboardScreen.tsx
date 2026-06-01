import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore }  from "@gymtracker/stores";
import { useWorkouts }   from "@gymtracker/hooks";
import type { Workout }  from "@gymtracker/types";
import { StreakCard }        from "../../components/dashboard/StreakCard";
import { StatCard }          from "../../components/dashboard/StatCard";
import { RecentWorkoutItem } from "../../components/dashboard/RecentWorkoutItem";
import { tokens }            from "../../theme/tokens";

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatVolume = (kg: number): string =>
  kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${Math.round(kg)}`;

export const DashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const {
    data: workouts = [],
    isLoading,
    isRefetching,
    refetch,
  } = useWorkouts();

  const thisMonthCount = workouts.filter((w: Workout) => {
    const d   = new Date(w.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() &&
           d.getFullYear() === now.getFullYear();
  }).length;

  const totalKg = workouts.reduce((acc, w) =>
    acc + (w.workout_exercises ?? []).reduce((eAcc, e) =>
      eAcc + (e.sets ?? 0) * (e.reps ?? 0) * (e.weight ?? 0), 0), 0);

  // Show 5 instead of 3 — fills the screen naturally
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}  // was 100
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={tokens.colors.accent}
          />
        }
      >
        {/* Header — tighter top padding */}
        <View
          className="px-5 pb-4"                        // was pb-6
          style={{ paddingTop: insets.top + 12 }}      // was +20
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text style={{ fontSize: 13, color: "#8E8E93", fontWeight: "500" }}>
                {getGreeting()}
              </Text>
              <Text style={{ fontSize: 22, color: "#FFFFFF",  // was text-2xl
                             fontWeight: "700", marginTop: 2, letterSpacing: -0.3 }}>
                {user?.username ?? "Athlete"} 👋
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 38, height: 38,           // was w-11 h-11
                borderRadius: 19,
                backgroundColor: "#7C5CFC",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                {user?.username?.[0]?.toUpperCase() ?? "A"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4" style={{ gap: 10 }}>  {/* was gap-3 = 12px → 10px */}

          <StreakCard workouts={workouts} />

          <View className="flex-row" style={{ gap: 10 }}>
            <View style={{ flex: 1 }}>
              <StatCard value={thisMonthCount.toString()} label="Workouts this month" />
            </View>
            <View style={{ flex: 1 }}>
              <StatCard value={formatVolume(totalKg)} label="Total kg lifted" />
            </View>
          </View>

          {/* Recent workouts */}
          <View>
            <View className="flex-row items-center justify-between"
                  style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: "#8E8E93",
                             fontWeight: "500", textTransform: "uppercase",
                             letterSpacing: 0.8 }}>
                Recent workouts
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text style={{ fontSize: 12, color: "#7C5CFC" }}>See all</Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={{ alignItems: "center", paddingVertical: 24 }}>
                <ActivityIndicator color={tokens.colors.accent} />
              </View>
            ) : recentWorkouts.length === 0 ? (
              <View className="bg-surface rounded-md border border-border-default"
                    style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ color: "#8E8E93", fontSize: 13, textAlign: "center" }}>
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
        style={{
          position:        "absolute",
          right:           20,
          bottom:          insets.bottom + 16,
          width:           52,           // was w-14 = 56px
          height:          52,
          borderRadius:    14,
          backgroundColor: "#7C5CFC",
          alignItems:      "center",
          justifyContent:  "center",
        }}
        onPress={() => navigation.navigate("Log")}
        activeOpacity={0.85}
      >
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "300",
                       lineHeight: 28, marginTop: -1 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};