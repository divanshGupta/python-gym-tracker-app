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
import { Ionicons }          from "@expo/vector-icons";

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

  const firstName = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : "Athlete";

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
                {firstName ?? "Athlete"} 
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

        {isLoading ? (
          <View className="px-4" style={{ gap: 10 }}>
            <StreakCard workouts={workouts} />

            <View className="flex-row" style={{ gap: 10 }}>
              <View style={{ flex: 1 }}>
                <StatCard value={thisMonthCount.toString()} label="Workouts this month" />
              </View>
              <View style={{ flex: 1 }}>
                <StatCard value={formatVolume(totalKg)} label="Total kg lifted" />
              </View>
            </View>

            <View>
              <View className="flex-row items-center justify-between" style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 11, color: "#8E8E93", fontWeight: "500", textTransform: "uppercase", letterSpacing: 0.8 }}>
                  Recent workouts
                </Text>
              </View>
              <View style={{ alignItems: "center", paddingVertical: 24 }}>
                <ActivityIndicator color={tokens.colors.accent} />
              </View>
            </View>
          </View>
        ) : workouts.length === 0 ? (
          <View className="px-4" style={{ gap: 12 }}>
            {/* Welcome / Onboarding Card */}
            <View className="bg-surface rounded-md border border-border-default px-5 py-4">
              <Text style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "700", letterSpacing: -0.2 }}>
                Welcome to GymTracker! 🚀
              </Text>
              <Text style={{ fontSize: 13, color: "#8E8E93", marginTop: 6, lineHeight: 18 }}>
                Let's get you set up. Complete these quick steps to build your training habits and start logging your progress.
              </Text>
            </View>

            <Text style={{ fontSize: 11, color: "#8E8E93", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 8, marginBottom: 4 }}>
              Get Started
            </Text>

            {/* Step 1: Browse Exercise Library */}
            <TouchableOpacity
              className="bg-surface rounded-md border border-border-default p-4 flex-row items-center"
              style={{ gap: 14 }}
              onPress={() => navigation.navigate("Exercises")}
              activeOpacity={0.8}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(124, 92, 252, 0.12)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="barbell-outline" size={18} color="#7C5CFC" />
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 14, color: "#FFFFFF", fontWeight: "600" }}>
                  1. Explore Exercises
                </Text>
                <Text style={{ fontSize: 12, color: "#8E8E93", marginTop: 2 }}>
                  Browse 100+ movements with target muscles.
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#636366" />
            </TouchableOpacity>

            {/* Step 2: Log First Session */}
            <TouchableOpacity
              className="bg-surface rounded-md border border-border-default p-4 flex-row items-center"
              style={{ gap: 14 }}
              onPress={() => navigation.navigate("Log")}
              activeOpacity={0.8}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(124, 92, 252, 0.12)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="add-circle-outline" size={18} color="#7C5CFC" />
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 14, color: "#FFFFFF", fontWeight: "600" }}>
                  2. Log Your First Workout
                </Text>
                <Text style={{ fontSize: 12, color: "#8E8E93", marginTop: 2 }}>
                  Log your sets and reps to start your streak.
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#636366" />
            </TouchableOpacity>

            {/* Step 3: Customize Profile */}
            <TouchableOpacity
              className="bg-surface rounded-md border border-border-default p-4 flex-row items-center"
              style={{ gap: 14 }}
              onPress={() => navigation.navigate("Profile")}
              activeOpacity={0.8}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(124, 92, 252, 0.12)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="person-outline" size={18} color="#7C5CFC" />
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 14, color: "#FFFFFF", fontWeight: "600" }}>
                  3. Set Up Your Profile
                </Text>
                <Text style={{ fontSize: 12, color: "#8E8E93", marginTop: 2 }}>
                  Update your training metrics and details.
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#636366" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="px-4" style={{ gap: 10 }}>
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
            </View>
          </View>
        )}
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