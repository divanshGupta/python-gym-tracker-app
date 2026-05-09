import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Alert, StatusBar, KeyboardAvoidingView, Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWorkoutSessionStore } from "@gymtracker/stores";
import { ExercisePickerModal } from "../../components/workouts/ExercisePickerModal";
import { ActiveExerciseSection } from "../../components/workouts/ActiveExerciseSection";
import { tokens } from "../../theme/tokens";

const useElapsedTime = (startTime: Date | null) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const LogWorkoutScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    activeWorkoutName, activeExercises, sessionStartTime,
    startSession, finishSession, cancelSession,
  } = useWorkoutSessionStore();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState("Morning workout");
  const elapsed = useElapsedTime(sessionStartTime);
  const hasStarted = !!sessionStartTime;

  const handleStart = () => {
    if (!workoutName.trim()) return;
    startSession(workoutName.trim());
  };

  const handleFinish = () => {
    const completedSets = activeExercises.reduce(
      (acc, e) => acc + e.sets.filter((s) => s.completed).length, 0
    );
    Alert.alert(
      "Finish workout?",
      `${completedSets} sets logged across ${activeExercises.length} exercise${activeExercises.length !== 1 ? "s" : ""}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Finish",
          onPress: async () => {
            await finishSession();
            navigation.navigate("Dashboard");
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel workout?",
      "All progress will be lost.",
      [
        { text: "Keep going", style: "cancel" },
        { text: "Cancel workout", style: "destructive", onPress: () => { cancelSession(); } },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-void"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      {/* Header */}
      <View
        className="px-5 pb-3 border-b border-border-default"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={hasStarted ? handleCancel : () => navigation.goBack()}>
            <Text className="text-accent text-sm">
              {hasStarted ? "Cancel" : "← Back"}
            </Text>
          </TouchableOpacity>
          {hasStarted && (
            <View className="bg-elevated rounded-sm px-3 py-1">
              <Text className="text-accent-light text-xs font-medium">{elapsed}</Text>
            </View>
          )}
        </View>

        {!hasStarted ? (
          <>
            <Text className="text-text-primary text-lg font-semibold mb-3">
              New workout
            </Text>
            <TextInput
              className="bg-surface border border-border-default rounded-md px-4 py-3 text-text-primary text-sm mb-3"
              placeholder="Workout name (e.g. Push Day A)"
              placeholderTextColor={tokens.colors.textSecondary}
              value={workoutName}
              onChangeText={setWorkoutName}
            />
            <TouchableOpacity
              className="bg-accent rounded-md py-3.5 items-center"
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Text className="text-white text-sm font-semibold">Start workout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View>
            <Text className="text-text-primary text-lg font-semibold">
              {activeWorkoutName}
            </Text>
            <Text className="text-text-secondary text-xs mt-0.5">
              {activeExercises.length} exercise{activeExercises.length !== 1 ? "s" : ""}
              {" · "}
              {activeExercises.reduce((a, e) => a + e.sets.filter((s) => s.completed).length, 0)} sets done
            </Text>
          </View>
        )}
      </View>

      {hasStarted && (
        <>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 12 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {activeExercises.map((ae) => (
              <ActiveExerciseSection key={ae.localId} activeExercise={ae} />
            ))}

            {/* Add exercise */}
            <TouchableOpacity
              className="border border-dashed border-border-strong rounded-md py-3.5 items-center"
              onPress={() => setPickerVisible(true)}
              activeOpacity={0.7}
            >
              <Text className="text-text-tertiary text-sm">+ Add exercise</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom bar */}
          <View
            className="px-4 pt-3 border-t border-border-default bg-void"
            style={{ paddingBottom: insets.bottom + 12 }}
          >
            <TouchableOpacity
              className="bg-accent rounded-md py-4 items-center"
              onPress={handleFinish}
              activeOpacity={0.85}
            >
              <Text className="text-white text-sm font-semibold">Finish workout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <ExercisePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};