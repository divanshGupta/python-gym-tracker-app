import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// shared packages
import { useCreateWorkout } from "@gymtracker/hooks";
import {
  WORKOUT_TYPES,
  type WorkoutInput,
  type WorkoutType,
} from "@gymtracker/types";
import {
  AppCard,
  AppHeader,
  Input,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
} from "../../components/ui";
import { ExercisePickerModal } from "../../components/workouts/ExercisePickerModal";
import { tokens } from "../../theme/tokens";

interface FormExercise {
  exercise_id: number;
  name: string;
  category: string;
  sets: string;
  reps: string;
  weight: string;
}

export const LogWorkoutScreen = ({ navigation }: any) => {
  const { mutate: createWorkout, isPending } = useCreateWorkout();

  // Form State
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
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

  const handleUpdateExercise = (
    index: number,
    field: keyof FormExercise,
    val: string,
  ) => {
    setExercises((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: val } : item,
      ),
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
        setValidationError(
          `Exercise #${i + 1} (${ex.name}) sets must be a positive number`,
        );
        return;
      }
      if (ex.reps && (isNaN(Number(ex.reps)) || Number(ex.reps) <= 0)) {
        setValidationError(
          `Exercise #${i + 1} (${ex.name}) reps must be a positive number`,
        );
        return;
      }
      if (ex.weight && (isNaN(Number(ex.weight)) || Number(ex.weight) <= 0)) {
        setValidationError(
          `Exercise #${i + 1} (${ex.name}) weight must be a positive number`,
        );
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
        navigation.navigate("Workout");
      },
      onError: (err: any) => {
        Alert.alert(
          "Error",
          err?.response?.data?.detail ?? "Failed to save workout",
        );
      },
    });
  };

  // const renderSaveButton = () => (
  //   <TouchableOpacity onPress={handleSubmit} disabled={isPending} className="p-1 -mr-1">
  //     {isPending ? (
  //       <ActivityIndicator size="small" color={tokens.colors.accent} />
  //     ) : (
  //       <Text className="text-accent text-sm font-semibold">Save</Text>
  //     )}
  //   </TouchableOpacity>
  // );

  return (
    <View className="flex-1 bg-void">
      <StatusBar
        barStyle="light-content"
        backgroundColor={tokens.colors.void}
      />

      {/* Header */}
      <AppHeader
        title="Log Workout"
        showBack
        onBackPress={() => navigation.goBack()}
        // rightElement={renderSaveButton()}
        safeArea
        style={{ paddingHorizontal: 4 }}
      />

      <ScreenContainer
        scrollable
        keyboardAvoiding
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {/* Error message */}
        {validationError && (
          <View className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3">
            <Text className="text-sm text-danger font-semibold">
              {validationError}
            </Text>
          </View>
        )}

        {/* Workout Details Container */}
        <AppCard className="mb-4" style={{ gap: 0 }}>
          <Text className="text-sm font-semibold text-text-primary mb-3.5">
            Workout Details
          </Text>

          {/* Date Picker Button */}
          <View className="mb-4">
            <Text className="text-2xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider px-0.5">
              Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-between bg-elevated border border-border-default rounded-xl px-4"
              style={{ height: 48 }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={tokens.colors.textSecondary}
                />
                <Text className="text-text-primary text-sm font-medium">
                  {date}
                </Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={14}
                color={tokens.colors.textTertiary}
              />
            </TouchableOpacity>
          </View>

          {/* Workout Type Segmented Control */}
          <View className="mb-5">
            <Text className="text-2xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider px-0.5">
              Workout Type
            </Text>
            <View className="flex-row justify-between">
              {WORKOUT_TYPES.map((t, idx) => {
                const active = type === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    className={`flex-1 py-2.5 rounded-xl items-center border capitalize ${
                      idx > 0 ? "ml-2" : ""
                    } ${
                      active
                        ? "bg-accent border-accent"
                        : "bg-elevated border-border-default"
                    }`}
                    activeOpacity={0.8}
                  >
                    <Text
                      className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Duration & Calories */}
          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <Input
                label="Duration (mins)"
                placeholder="60"
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <View className="flex-1 ml-2">
              <Input
                label="Calories Burned"
                placeholder="400"
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
          </View>

          {/* Notes */}
          <Input
            label="Notes"
            placeholder="How was today's session?"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
            style={{ height: 80, textAlignVertical: "top" }}
            containerStyle={{ marginTop: 16, marginBottom: 0 }}
          />
        </AppCard>

        {/* Exercises Section */}
        <AppCard>
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-sm font-semibold text-text-primary">
                Exercises
              </Text>
              <Text className="text-2xs text-text-secondary mt-0.5 font-semibold uppercase tracking-wider">
                Logged today
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              className="bg-accent rounded-xl px-4 py-2"
              activeOpacity={0.85}
            >
              <Text className="text-white text-xs font-semibold">
                Add Exercise
              </Text>
            </TouchableOpacity>
          </View>

          {exercises.length === 0 ? (
            <View className="border border-dashed border-border-default rounded-xl p-6 items-center justify-center my-2">
              <Ionicons
                name="barbell-outline"
                size={24}
                color={tokens.colors.textTertiary}
                className="mb-2"
              />
              <Text className="text-text-secondary text-xs text-center leading-relaxed font-semibold">
                No exercises added yet.{"\n"}Tap 'Add Exercise' to build your
                list.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {exercises.map((e, index) => (
                <AppCard
                  key={index}
                  className="bg-elevated/20 border-border-default p-4"
                >
                  {/* Exercise Header */}
                  <View className="flex-row items-center justify-between mb-3.5">
                    <Text
                      className="text-sm font-semibold text-text-primary capitalize truncate flex-1 mr-2"
                      numberOfLines={1}
                    >
                      {index + 1}. {e.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveExercise(index)}
                      className="py-1 px-2 -mr-2"
                    >
                      <Text className="text-danger text-xs font-semibold">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Sets / Reps / Weight Inputs */}
                  <View className="flex-row justify-between">
                    <View className="flex-1 mr-2">
                      <Text className="text-text-secondary text-3xs font-semibold uppercase mb-1.5 text-center tracking-wider">
                        Sets
                      </Text>
                      <TextInput
                        className="bg-surface border border-border-default rounded-xl px-2 text-text-primary text-xs text-center font-bold"
                        style={{ height: 38 }}
                        placeholder="4"
                        placeholderTextColor={tokens.colors.textTertiary}
                        keyboardType="numeric"
                        value={e.sets}
                        onChangeText={(val) =>
                          handleUpdateExercise(index, "sets", val)
                        }
                      />
                    </View>
                    <View className="flex-1 mx-1">
                      <Text className="text-text-secondary text-3xs font-semibold uppercase mb-1.5 text-center tracking-wider">
                        Reps
                      </Text>
                      <TextInput
                        className="bg-surface border border-border-default rounded-xl px-2 text-text-primary text-xs text-center font-bold"
                        style={{ height: 38 }}
                        placeholder="12"
                        placeholderTextColor={tokens.colors.textTertiary}
                        keyboardType="numeric"
                        value={e.reps}
                        onChangeText={(val) =>
                          handleUpdateExercise(index, "reps", val)
                        }
                      />
                    </View>
                    <View className="flex-1 ml-2">
                      <Text className="text-text-secondary text-3xs font-semibold uppercase mb-1.5 text-center tracking-wider">
                        Weight (kg)
                      </Text>
                      <TextInput
                        className="bg-surface border border-border-default rounded-xl px-2 text-text-primary text-xs text-center font-bold"
                        style={{ height: 38 }}
                        placeholder="80"
                        placeholderTextColor={tokens.colors.textTertiary}
                        keyboardType="numeric"
                        value={e.weight}
                        onChangeText={(val) =>
                          handleUpdateExercise(index, "weight", val)
                        }
                      />
                    </View>
                  </View>
                </AppCard>
              ))}
            </View>
          )}
        </AppCard>

        {/* Submit Actions */}
        <View className="flex-row justify-between mt-6" style={{ gap: 12 }}>
          <SecondaryButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            title="Save Workout"
            onPress={handleSubmit}
            loading={isPending}
            style={{ flex: 1 }}
          />
        </View>
      </ScreenContainer>

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
    </View>
  );
};
