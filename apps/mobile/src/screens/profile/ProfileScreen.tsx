import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, Alert, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "@gymtracker/stores";
import { useWorkouts } from "@gymtracker/hooks";
import { SettingsRow } from "./SettingsRow";
import { tokens } from "../../theme/tokens";

type WeightUnit = "kg" | "lbs";

export const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const {
      data: workouts = [],
    } = useWorkouts();

  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [restTimer, setRestTimer] = useState(true);
  const [notifications, setNotifications] = useState(false);

  const totalWorkouts = workouts.length;
  const totalKg = workouts.reduce((acc, w) =>
    acc + (w.workout_exercises ?? []).reduce((eAcc, e) =>
      eAcc + (e.sets ?? 0) * (e.reps ?? 0) * (e.weight ?? 0), 0), 0);

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  const handleUnitToggle = () => {
    setWeightUnit((u) => (u === "kg" ? "lbs" : "kg"));
  };

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5" style={{ paddingTop: insets.top + 12 }}>
          <Text className="text-text-primary text-lg font-semibold mb-4">
            Profile
          </Text>
        </View>

        <View className="px-4 gap-3">

          {/* Avatar card */}
          <View className="bg-surface rounded-md border border-border-default p-4 flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-accent items-center justify-center mr-4">
              <Text className="text-white text-xl font-semibold">
                {user?.username?.[0]?.toUpperCase() ?? "A"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-primary text-base font-semibold">
                {user?.username ?? "Athlete"}
              </Text>
              <Text className="text-text-secondary text-xs mt-0.5">
                {user?.email ?? ""}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-elevated rounded-sm px-3 py-2"
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text className="text-text-secondary text-xs font-medium">Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Stats summary */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-md border border-border-default p-3">
              <Text className="text-text-primary font-semibold" style={{ fontSize: 22, letterSpacing: -0.5 }}>
                {totalWorkouts}
              </Text>
              <Text className="text-text-secondary mt-0.5" style={{ fontSize: 11 }}>
                Total workouts
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-md border border-border-default p-3">
              <Text className="text-text-primary font-semibold" style={{ fontSize: 22, letterSpacing: -0.5 }}>
                {totalKg >= 1000
                  ? `${(totalKg / 1000).toFixed(1)}t`
                  : `${Math.round(totalKg)}`}
              </Text>
              <Text className="text-text-secondary mt-0.5" style={{ fontSize: 11 }}>
                Total {weightUnit} lifted
              </Text>
            </View>
          </View>

          {/* Preferences */}
          <SectionLabel label="Preferences" />
          <View className="bg-surface rounded-md border border-border-default overflow-hidden">
            <SettingsRow
              iconBg="#2C1F5E"
              iconColor="#7C5CFC"
              iconShape="square"
              label="Weight unit"
              rightElement={
                <TouchableOpacity
                  className="bg-elevated rounded-sm px-2.5 py-1 flex-row items-center gap-1"
                  onPress={handleUnitToggle}
                >
                  <Text className="text-text-secondary text-xs font-medium">
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
                  trackColor={{ false: "#2C2C2E", true: tokens.colors.accent }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#2C2C2E"
                />
              }
              isLast
            />
          </View>

          {/* Notifications */}
          <View className="bg-surface rounded-md border border-border-default overflow-hidden">
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
          </View>

          {/* Account */}
          <SectionLabel label="Account" />
          <View className="bg-surface rounded-md border border-border-default overflow-hidden">
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
          </View>

          {/* Logout */}
          <TouchableOpacity
            className="bg-surface rounded-md border py-4 items-center mt-1"
            style={{ borderColor: "#3A1515" }}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text className="text-danger text-sm font-medium">Log out</Text>
          </TouchableOpacity>

          {/* Version */}
          <Text className="text-center mt-2" style={{ fontSize: 11, color: "#3A3A3C" }}>
            GymTracker v1.0.0
          </Text>

        </View>
      </ScrollView>
    </View>
  );
};

const SectionLabel = ({ label }: { label: string }) => (
  <Text
    className="text-text-tertiary font-medium uppercase"
    style={{ fontSize: 11, letterSpacing: 0.5, paddingLeft: 2 }}
  >
    {label}
  </Text>
);