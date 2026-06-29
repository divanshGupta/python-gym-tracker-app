import { useWorkouts, useWorkoutStats } from "@gymtracker/hooks";
import { useAuthStore } from "@gymtracker/stores";
import { useState } from "react";
import { Alert, StatusBar, Text, TouchableOpacity, View } from "react-native";
import {
  AppCard,
  AppHeader,
  ScreenContainer,
  SectionHeader,
  StatCard,
} from "../../components/ui";
import { tokens } from "../../theme/tokens";
import { SettingsRow } from "./SettingsRow";

type WeightUnit = "kg" | "lbs";

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();
  const { data: workouts = [] } = useWorkouts();
  const { data: stats } = useWorkoutStats();

  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  // const [restTimer, setRestTimer] = useState(true);
  // const [notifications, setNotifications] = useState(false);

  const totalWorkouts = workouts.length;
  const totalKg = workouts.reduce(
    (acc, w) =>
      acc +
      (w.workout_exercises ?? []).reduce(
        (eAcc, e) => eAcc + (e.sets ?? 0) * (e.reps ?? 0) * (e.weight ?? 0),
        0,
      ),
    0,
  );

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const handleUnitToggle = () => {
    setWeightUnit((u) => (u === "kg" ? "lbs" : "kg"));
  };

  return (
    <View className="flex-1 bg-void">
      <StatusBar
        barStyle="light-content"
        backgroundColor={tokens.colors.void}
      />

      <ScreenContainer scrollable contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <AppHeader title="Profile" safeArea />

        <View className="px-4" style={{ gap: 16 }}>
          {/* Avatar card */}
          <AppCard className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-accent items-center justify-center mr-4">
              <Text className="text-white text-lg font-bold">
                {user?.username?.[0]?.toUpperCase() ?? "A"}
              </Text>
            </View>
            <View className="flex-1 mr-4">
              <Text className="text-text-primary text-base font-semibold">
                {user?.username ?? "Athlete"}
              </Text>
              <Text
                className="text-text-secondary text-xs mt-0.5"
                numberOfLines={1}
              >
                {user?.email ?? ""}
              </Text>
            </View>
            {/* there is no feature for edit profile rn */}
            {/* <TouchableOpacity
              className="bg-elevated border border-border-default rounded-xl px-3.5 py-2"
              onPress={() => navigation.navigate("EditProfile")}
              activeOpacity={0.8}
            >
              <Text className="text-text-secondary text-xs font-semibold">Edit</Text>
            </TouchableOpacity> */}
          </AppCard>

          {/* Stats summary */}
          <View className="flex-row" style={{ gap: 12 }}>
            <StatCard value={totalWorkouts} label="Total workouts" />
            <StatCard
              value={
                totalKg >= 1000
                  ? `${(totalKg / 1000).toFixed(1)}t`
                  : `${Math.round(totalKg)}`
              }
              label={`Total ${weightUnit} lifted`}
            />
            <StatCard
              value={stats?.total_duration_minutes ?? "--"}
              label={`Total duration`}
            />
          </View>

          {/* Preferences Section */}
          {/* <View>
            <SectionHeader title="Preferences" />
            <AppCard className="p-0 overflow-hidden" style={{ gap: 0 }}>
              <SettingsRow
                iconBg="#2C1F5E"
                iconColor="#7C5CFC"
                iconShape="square"
                label="Weight unit"
                rightElement={
                  <TouchableOpacity
                    className="bg-elevated border border-border-default rounded-xl px-3 py-1.5 flex-row items-center"
                    onPress={handleUnitToggle}
                    activeOpacity={0.8}
                  >
                    <Text className="text-text-secondary text-xs font-semibold uppercase">
                      {weightUnit}
                    </Text>
                  </TouchableOpacity>
                }
              />
              <SettingsRow
                iconBg="#1A2E1A"
                iconColor="#22C55E"
                iconShape="circle"
                label="Rest timer"
                rightElement={
                  <Switch
                    value={restTimer}
                    onValueChange={setRestTimer}
                    trackColor={{
                      false: "#2C2C2E",
                      true: tokens.colors.accent,
                    }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#2C2C2E"
                  />
                }
                isLast
              />
            </AppCard>
          </View> */}

          {/* Notifications Section */}
          {/* <View>
            <AppCard className="p-0 overflow-hidden">
              <SettingsRow
                iconBg="#2A2010"
                iconColor="#F59E0B"
                iconShape="rect"
                label="Notifications"
                rightElement={
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: "#2C2C2E", true: tokens.colors.accent }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#2C2C2E"
                  />
                }
                isLast
              />
            </AppCard>
          </View> */}

          {/* Account Section */}
          {/* <View>
            <SectionHeader title="Account" />
            <AppCard className="p-0 overflow-hidden">
              <SettingsRow
                iconBg="#1C1C2E"
                iconColor="#8E8E93"
                iconShape="square"
                label="Change password"
                showChevron
                onPress={() => navigation.navigate("ChangePassword")}
              />
              <SettingsRow
                iconBg="#1C1C2E"
                iconColor="#8E8E93"
                iconShape="circle"
                label="Privacy policy"
                showChevron
                onPress={() => {}}
                isLast
              />
            </AppCard>
          </View> */}

          {/* Goals and Measuremnts Links */}
          <View>
            {/* <SectionHeader title="Account" /> */}
            <AppCard className="p-0 overflow-hidden">
              <SettingsRow
                iconBg="#2C1F5E"
                iconColor="#7C5CFC"
                iconShape="square"
                label="Goals"
                showChevron
                onPress={() => navigation.navigate("Goals")}
              />
              <SettingsRow
                iconBg="#1A2E1A"
                iconColor="#22C55E"
                iconShape="circle"
                label="Measurements"
                showChevron
                onPress={() => navigation.navigate("Measurements")}
              />
            </AppCard>
          </View>

          {/* Logout button */}
          <TouchableOpacity
            className="bg-surface rounded-xl border border-danger/25 py-4 items-center mt-2"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text className="text-danger text-sm font-semibold">Log out</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text className="text-center text-text-tertiary mt-2 text-2xs uppercase tracking-widest font-semibold">
            GymTracker v1.0.0
          </Text>
        </View>
      </ScreenContainer>
    </View>
  );
};
