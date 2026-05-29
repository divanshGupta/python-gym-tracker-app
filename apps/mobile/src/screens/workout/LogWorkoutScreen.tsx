import React, { useState } from "react";
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Alert, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// shared packages
import { useCreateWorkout } from "@gymtracker/hooks";
import { WORKOUT_TYPES, type WorkoutInput, type WorkoutType } from "@gymtracker/types";
import { tokens } from "../../theme/tokens";
import { ExercisePickerModal } from "../../components/workouts/ExercisePickerModal";

interface FormExercise {
  exercise_id: number;
  name: string;
  category: string;
  sets: string;
  reps: string;
  weight: string;
}

export const LogWorkoutScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { mutate: createWorkout, isPending } = useCreateWorkout();

  // Form State
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<WorkoutType>("strength");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<FormExercise[]>([]);

  // Modal State
  const [pickerVisible, setPickerVisible] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Date handlers
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setDate(formatted);
    }
  };

  // Exercise handlers
  const handleAddExercise = (exercise: any) => {
    setExercises((prev) => [
      ...prev,
      {
        exercise_id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        sets: "",
        reps: "",
        weight: "",
      },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (index: number, field: keyof FormExercise, val: string) => {
    setExercises((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  // Submit form
  const handleSubmit = () => {
    setValidationError(null);

    // Validation
    if (!date) {
      setValidationError("Date is required");
      return;
    }

    if (duration && (isNaN(Number(duration)) || Number(duration) <= 0)) {
      setValidationError("Duration must be a positive number");
      return;
    }

    if (calories && (isNaN(Number(calories)) || Number(calories) <= 0)) {
      setValidationError("Calories burned must be a positive number");
      return;
    }

    if (exercises.length === 0) {
      setValidationError("Please add at least one exercise");
      return;
    }

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i];
      if (ex.sets && (isNaN(Number(ex.sets)) || Number(ex.sets) <= 0)) {
        setValidationError(`Exercise #${i + 1} (${ex.name}) sets must be a positive number`);
        return;
      }
      if (ex.reps && (isNaN(Number(ex.reps)) || Number(ex.reps) <= 0)) {
        setValidationError(`Exercise #${i + 1} (${ex.name}) reps must be a positive number`);
        return;
      }
      if (ex.weight && (isNaN(Number(ex.weight)) || Number(ex.weight) <= 0)) {
        setValidationError(`Exercise #${i + 1} (${ex.name}) weight must be a positive number`);
        return;
      }
    }

    // Payload construction
    const payload: WorkoutInput = {
      date,
      type,
      duration: duration.trim() ? parseInt(duration, 10) : null,
      calories: calories.trim() ? parseInt(calories, 10) : null,
      notes: notes.trim() ? notes : null,
      exercises: exercises.map((e) => ({
        exercise_id: e.exercise_id,
        sets: e.sets.trim() ? parseInt(e.sets, 10) : null,
        reps: e.reps.trim() ? parseInt(e.reps, 10) : null,
        weight: e.weight.trim() ? parseFloat(e.weight) : null,
      })),
    };

    createWorkout(payload, {
      onSuccess: () => {
        Alert.alert("Success", "Workout logged successfully!");
        setExercises([]);
        setDuration("");
        setCalories("");
        setNotes("");
        setDate(new Date().toISOString().split("T")[0]);
        navigation.navigate("Dashboard");
      },
      onError: (err: any) => {
        Alert.alert("Error", err?.response?.data?.detail ?? "Failed to save workout");
      },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-void"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      {/* Header */}
      <View
        className="px-5 pb-3 border-b border-border-default"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-accent text-sm">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-text-primary text-base font-semibold">Log Workout</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={isPending}>
            {isPending ? (
              <ActivityIndicator size="small" color={tokens.colors.accent} />
            ) : (
              <Text className="text-accent text-sm font-semibold">Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Error message */}
        {validationError && (
          <View className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3">
            <Text className="text-sm text-danger font-medium">{validationError}</Text>
          </View>
        )}

        {/* Workout Details Container */}
        <View className="bg-surface border border-border-default rounded-xl p-4 mb-4">
          <Text className="text-text-primary text-sm font-semibold mb-3">Workout Details</Text>

          {/* Date Picker Button */}
          <View className="mb-4">
            <Text className="text-text-secondary text-xs mb-1.5 font-medium">Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-between bg-elevated border border-border-default rounded-xl px-4 py-3"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color={tokens.colors.textSecondary} className="mr-2" />
                <Text className="text-text-primary text-sm ml-2">{date}</Text>
              </View>
              <Ionicons name="chevron-down" size={14} color={tokens.colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* Workout Type Segmented Control */}
          <View className="mb-4">
            <Text className="text-text-secondary text-xs mb-1.5 font-medium">Workout Type</Text>
            <View className="flex-row justify-between">
              {WORKOUT_TYPES.map((t, idx) => {
                const active = type === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    className={`flex-1 py-2.5 rounded-xl items-center border capitalize ${idx > 0 ? "ml-1.5" : ""}`}
                    style={{
                      backgroundColor: active ? tokens.colors.accent : "#1C1C1E",
                      borderColor: active ? tokens.colors.accent : "#2C2C2E",
                    }}
                  >
                    <Text className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Duration & Calories */}
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-text-secondary text-xs mb-1.5 font-medium">Duration (mins)</Text>
              <TextInput
                className="bg-elevated border border-border-default rounded-xl px-4 py-3 text-text-primary text-sm"
                placeholder="60"
                placeholderTextColor={tokens.colors.textTertiary}
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-text-secondary text-xs mb-1.5 font-medium">Calories Burned</Text>
              <TextInput
                className="bg-elevated border border-border-default rounded-xl px-4 py-3 text-text-primary text-sm"
                placeholder="400"
                placeholderTextColor={tokens.colors.textTertiary}
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
              />
            </View>
          </View>

          {/* Notes */}
          <View>
            <Text className="text-text-secondary text-xs mb-1.5 font-medium">Notes</Text>
            <TextInput
              className="bg-elevated border border-border-default rounded-xl px-4 py-3 text-text-primary text-sm min-h-[80px]"
              multiline
              numberOfLines={3}
              placeholder="How was today's session?"
              placeholderTextColor={tokens.colors.textTertiary}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Exercises Section */}
        <View className="bg-surface border border-border-default rounded-xl p-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-text-primary text-sm font-semibold">Exercises</Text>
              <Text className="text-text-secondary text-[11px] mt-0.5">Performances logged today</Text>
            </View>
            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              className="bg-accent rounded-xl px-4 py-2"
              activeOpacity={0.85}
            >
              <Text className="text-white text-xs font-semibold">Add Exercise</Text>
            </TouchableOpacity>
          </View>

          {exercises.length === 0 ? (
            <View className="border border-dashed border-border-default rounded-xl p-6 items-center justify-center my-2">
              <Ionicons name="barbell-outline" size={24} color={tokens.colors.textTertiary} className="mb-2" />
              <Text className="text-text-secondary text-xs text-center">
                No exercises added yet.{"\n"}Tap 'Add Exercise' to build your list.
              </Text>
            </View>
          ) : (
            exercises.map((e, index) => (
              <View key={index} className="rounded-xl border border-border-default bg-elevated/30 p-4 mb-3">
                {/* Exercise Header */}
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-sm font-semibold text-text-primary capitalize truncate flex-1 mr-2" numberOfLines={1}>
                    {index + 1}. {e.name}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveExercise(index)} className="py-1 px-2">
                    <Text className="text-danger text-xs font-medium">Remove</Text>
                  </TouchableOpacity>
                </View>

                {/* Sets / Reps / Weight Inputs */}
                <View className="flex-row justify-between">
                  <View className="flex-1 mr-1.5">
                    <Text className="text-text-secondary text-3xs uppercase mb-1 text-center">Sets</Text>
                    <TextInput
                      className="bg-surface border border-border-default rounded-lg px-2 py-2 text-text-primary text-xs text-center font-semibold"
                      placeholder="4"
                      placeholderTextColor={tokens.colors.textTertiary}
                      keyboardType="numeric"
                      value={e.sets}
                      onChangeText={(val) => handleUpdateExercise(index, "sets", val)}
                    />
                  </View>
                  <View className="flex-1 mx-1.5">
                    <Text className="text-text-secondary text-3xs uppercase mb-1 text-center">Reps</Text>
                    <TextInput
                      className="bg-surface border border-border-default rounded-lg px-2 py-2 text-text-primary text-xs text-center font-semibold"
                      placeholder="12"
                      placeholderTextColor={tokens.colors.textTertiary}
                      keyboardType="numeric"
                      value={e.reps}
                      onChangeText={(val) => handleUpdateExercise(index, "reps", val)}
                    />
                  </View>
                  <View className="flex-1 ml-1.5">
                    <Text className="text-text-secondary text-3xs uppercase mb-1 text-center">Weight (kg)</Text>
                    <TextInput
                      className="bg-surface border border-border-default rounded-lg px-2 py-2 text-text-primary text-xs text-center font-semibold"
                      placeholder="80"
                      placeholderTextColor={tokens.colors.textTertiary}
                      keyboardType="numeric"
                      value={e.weight}
                      onChangeText={(val) => handleUpdateExercise(index, "weight", val)}
                    />
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Submit Actions */}
        <View className="flex-row justify-between mt-6" style={{ gap: 12 }}>
          <TouchableOpacity
            className="flex-1 bg-surface border border-border-default py-3.5 rounded-xl items-center"
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text className="text-text-primary text-sm font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-accent py-3.5 rounded-xl items-center"
            onPress={handleSubmit}
            disabled={isPending}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-sm font-semibold">Save Workout</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Exercise Library Picker Modal */}
      <ExercisePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={handleAddExercise}
      />
    </KeyboardAvoidingView>
  );
};