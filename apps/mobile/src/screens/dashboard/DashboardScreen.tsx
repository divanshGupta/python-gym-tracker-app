import {
  View, Text, TouchableOpacity, RefreshControl, StatusBar, ActivityIndicator, Alert,
} from "react-native";
import { useAuthStore }  from "@gymtracker/stores";
import { useWorkouts, useDeleteWorkout }   from "@gymtracker/hooks";
import type { Workout }  from "@gymtracker/types";

// ==================== COMPONENTS ============================
import { StreakCard }        from "../../components/dashboard/StreakCard";
import { tokens }            from "../../theme/tokens";
import { Ionicons }          from "@expo/vector-icons";
import {
  ScreenContainer, AppHeader, AppCard, SectionHeader, StatCard
} from "../../components/ui";
import { WorkoutRow } from "../../components/dashboard/WorkoutRow";

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatVolume = (kg: number): string =>
  kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${Math.round(kg)}`;

// ======================= SCREEN ===========================
export const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const { mutate: deleteWorkout } = useDeleteWorkout();

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

  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // delete function for recent workouts
  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete workout",
      "Are you sure you want to delete this workout session? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteWorkout(id),
        },
      ]
    );
  };

  const renderAvatar = () => (
    <TouchableOpacity
      className="px-3.5 py-2 flex-row rounded-full bg-accent items-center justify-center"
      onPress={() => navigation.navigate("Profile")}
      activeOpacity={0.8}
    >
      <Text className="text-white font-semibold text-sm">
        {user?.username?.[0]?.toUpperCase() ?? "A"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      <ScreenContainer
        scrollable
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={tokens.colors.accent}
          />
        }
      >
        {/* Header */}
        <AppHeader
          title={firstName ?? "Athlete"}
          subtitle={getGreeting()}
          rightElement={renderAvatar()}
          safeArea
        />

        {isLoading ? (
          <View className="px-4" style={{ gap: 12 }}>
            <StreakCard workouts={workouts} />

            <View className="flex-row" style={{ gap: 12 }}>
              <StatCard value={thisMonthCount.toString()} label="Workouts this month" />
              <StatCard value={formatVolume(totalKg)} label="Total kg lifted" unit="kg" />
            </View>

            <View className="mt-4">
              <SectionHeader title="Recent workouts" />
              <View className="items-center py-6">
                <ActivityIndicator color={tokens.colors.accent} />
              </View>
            </View>
          </View>
        ) : workouts.length === 0 ? (
          <View className="px-4" style={{ gap: 16 }}>
            {/* Welcome / Onboarding Card */}
            <AppCard>
              <Text className="text-sm font-bold text-text-primary mb-1">
                Welcome to GymTracker! 🚀
              </Text>
              <Text className="text-xs text-text-secondary leading-relaxed">
                Let's get you set up. Complete these quick steps to build your training habits and start logging your progress.
              </Text>
            </AppCard>

            <View className="mt-2">
              <SectionHeader title="Get Started" />

              <View style={{ gap: 10 }}>
                {/* Step 1: Browse Exercise Library */}
                <TouchableOpacity
                  className="bg-surface rounded-xl border border-border-default p-4 flex-row items-center justify-between"
                  onPress={() => navigation.navigate("Exercises")}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center flex-1 mr-4" style={{ gap: 12 }}>
                    <View className="w-9 h-9 rounded-lg bg-accent/10 items-center justify-center flex-shrink-0">
                      <Ionicons name="barbell-outline" size={16} color={tokens.colors.accent} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-text-primary">
                        1. Explore Exercises
                      </Text>
                      <Text className="text-2xs text-text-secondary mt-0.5">
                        Browse 100+ movements with target muscles.
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={14} color={tokens.colors.textTertiary} />
                </TouchableOpacity>

                {/* Step 2: Log First Session */}
                <TouchableOpacity
                  className="bg-surface rounded-xl border border-border-default p-4 flex-row items-center justify-between"
                  onPress={() => navigation.navigate("Log")}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center flex-1 mr-4" style={{ gap: 12 }}>
                    <View className="w-9 h-9 rounded-lg bg-accent/10 items-center justify-center flex-shrink-0">
                      <Ionicons name="add-circle-outline" size={16} color={tokens.colors.accent} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-text-primary">
                        2. Log Your First Workout
                      </Text>
                      <Text className="text-2xs text-text-secondary mt-0.5">
                        Log your sets and reps to start your streak.
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={14} color={tokens.colors.textTertiary} />
                </TouchableOpacity>

                {/* Step 3: Customize Profile */}
                <TouchableOpacity
                  className="bg-surface rounded-xl border border-border-default p-4 flex-row items-center justify-between"
                  onPress={() => navigation.navigate("Profile")}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center flex-1 mr-4" style={{ gap: 12 }}>
                    <View className="w-9 h-9 rounded-lg bg-accent/10 items-center justify-center flex-shrink-0">
                      <Ionicons name="person-outline" size={16} color={tokens.colors.accent} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-text-primary">
                        3. Set Up Your Profile
                      </Text>
                      <Text className="text-2xs text-text-secondary mt-0.5">
                        Update your training metrics and details.
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={14} color={tokens.colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View className="px-4" style={{ gap: 16 }}>
            <StreakCard workouts={workouts} />

            <View className="flex-row" style={{ gap: 12 }}>
              <StatCard value={thisMonthCount.toString()} label="Workouts this month" />
              <StatCard value={formatVolume(totalKg)} label="Total kg lifted" unit="kg" />
            </View>

            {/* Recent workouts */}
            <View className="mt-2">
              <SectionHeader
                title="Recent workouts"
                rightElement={
                  <TouchableOpacity onPress={() => navigation.navigate("Workout")}>
                    <Text className="text-xs font-semibold text-accent">See all</Text>
                  </TouchableOpacity>
                }
              />

              <AppCard className="p-0 overflow-hidden">
                {recentWorkouts.map((w: Workout) => {
                  return (
                    <WorkoutRow
                      key={w.id}
                      workout={w}
                      onDelete={handleDelete}
                      onPress={() => navigation.navigate("WorkoutDetail", { workoutId: w.id })}
                    />
              
                  );
                })}
              </AppCard>
            </View>
          </View>
        )}
      </ScreenContainer>

      {/* FAB */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: tokens.colors.accent,
          alignItems: "center",
          justifyContent: "center",
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4.5,
        }}
        onPress={() => navigation.navigate("Log")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};