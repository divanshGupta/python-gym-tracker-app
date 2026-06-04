{/* the edit button is not functional yet, we need to create a editworkoutscreen */}
import {
  View, Text, TouchableOpacity,
  StatusBar, Alert, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useWorkout, useDeleteWorkout } from "@gymtracker/hooks";
import type { WorkoutExercise } from "@gymtracker/types";
import { tokens } from "../../theme/tokens";
import { AppHeader, ScreenContainer } from "../../components/ui";

// ── Type colour accent bar ───────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  strength:    "#7C5CFC",
  cardio:      "#22C55E",
  flexibility: "#F59E0B",
  core:        "#EF4444",
};

// ── Stat card ────────────────────────────────────────────────────────────
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 bg-surface border border-border-default rounded-xl p-4 items-center">
      <Text className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest mb-2">
        {label}
      </Text>
      <Text className="text-lg font-semibold text-text-primary">{value}</Text>
    </View>
  );
}

// ── Exercise row ─────────────────────────────────────────────────────────
function ExerciseRow({ we, index }: { we: WorkoutExercise; index: number }) {
  const accentColor = TYPE_COLOR[we.exercise?.category ?? "strength"] ?? "#7C5CFC";

  return (
    <View className="bg-elevated/40 border border-border-default rounded-xl overflow-hidden">
      {/* Accent bar */}
      <View style={{ height: 3, backgroundColor: accentColor }} />

      <View className="px-4 py-3.5">
        {/* Exercise name + category */}
        <View className="flex-row items-center gap-2 mb-3">
          <Text className="text-sm font-semibold text-text-primary capitalize flex-1">
            {we.exercise?.name ?? "Unknown exercise"}
          </Text>
          {/* <View className="bg-surface border border-border-default rounded-md px-2 py-0.5">
            <Text className="text-[10px] text-text-tertiary capitalize">
              {we.exercise?.category ?? "—"}
            </Text>
          </View> */}
        </View>

        {/* Sets / Reps / Weight */}
        <View className="flex-row justify-between" >
          {we.sets != null && (
            <View>
              <Text className="text-[10px] text-text-tertiary mb-1">Sets</Text>
              <Text className="text-sm font-semibold text-text-primary">{we.sets}</Text>
            </View>
          )}
          {we.reps != null && (
            <View>
              <Text className="text-[10px] text-text-tertiary mb-1">Reps</Text>
              <Text className="text-sm font-semibold text-text-primary">{we.reps}</Text>
            </View>
          )}
          {we.weight != null && (
            <View>
              <Text className="text-[10px] text-text-tertiary mb-1">Weight</Text>
              <Text className="text-sm font-semibold text-text-primary">{we.weight} kg</Text>
            </View>
          )}
          {/* {we.duration_seconds != null && (
            <View>
              <Text className="text-[10px] text-text-tertiary mb-1">Duration</Text>
              <Text className="text-sm font-semibold text-text-primary">
                {Math.round(we.duration_seconds / 60)} min
              </Text>
            </View>
          )} */}
        </View>
      </View>
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────
export const WorkoutDetailScreen = ({ route, navigation }: any) => {
  const { workoutId } = route.params as { workoutId: number };

  const { data: workout, isLoading } = useWorkout(workoutId);
  const { mutate: deleteWorkout, isPending: isDeleting } = useDeleteWorkout();

  const typeColor = TYPE_COLOR[workout?.type ?? "strength"] ?? "#7C5CFC";

  const handleDelete = () => {
    Alert.alert(
      "Delete workout",
      "Are you sure you want to delete this workout? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteWorkout(workoutId, {
              onSuccess: () => navigation.goBack(),
              onError:   () =>
                Alert.alert("Error", "Failed to delete workout. Please try again."),
            }),
        },
      ]
    );
  };

  // ── Loading ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View className="flex-1 bg-void items-center justify-center">
        <ActivityIndicator size="large" color={tokens.colors.accent} />
      </View>
    );
  }

  // ── Not found ───────────────────────────────────────────────────────
  if (!workout) {
    return (
      <View className="flex-1 bg-void">
        <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />
        <AppHeader
          title="Workout"
        //   leftElement={
        //     <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
        //       <Ionicons name="chevron-back" size={22} color={tokens.colors.textPrimary} />
        //     </TouchableOpacity>
        //   }
          safeArea
        />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-text-secondary text-sm text-center">
            Workout not found.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-4 px-5 py-2.5 bg-surface border border-border-default rounded-xl"
          >
            <Text className="text-text-primary text-sm font-medium">Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const exercises = workout.workout_exercises ?? [];

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      {/* Header */}
      <AppHeader
        title={`${workout.type.charAt(0).toUpperCase() + workout.type.slice(1)} Workout`}
        subtitle={workout.date}
        // leftElement={
        //   <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
        //     <Ionicons name="chevron-back" size={22} color={tokens.colors.textPrimary} />
        //   </TouchableOpacity>
        // }
        rightElement={
          <View className="flex-row items-center gap-2">
            {/* Edit button */}
            {/* the edit button is not functional yet, we need to create a editworkoutscreen */}
            {/* <TouchableOpacity
              onPress={() => navigation.navigate("EditWorkout", { workoutId: workout.id })}
              className="flex-row items-center gap-1.5 bg-surface border border-border-default rounded-xl px-3.5 py-2"
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={14} color={tokens.colors.textPrimary} />
              <Text className="text-text-primary text-xs font-semibold">Edit</Text>
            </TouchableOpacity> */}

            {/* Delete button */}
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDeleting}
              className="bg-danger/15 border border-danger/30 rounded-xl px-3.5 py-2 flex-row items-center"
              activeOpacity={0.8}
              style={{ gap: 4 }}
            >
              {isDeleting ? (
                <ActivityIndicator size={12} color="#EF4444" />
              ) : (
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
              )}
              <Text className="text-danger text-xs font-semibold">
                {isDeleting ? "Deleting…" : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        }
        safeArea
      />

      <ScreenContainer
        scrollable
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      >
        {/* ── Type accent banner ── */}
        <View
          className="rounded-xl px-4 py-3 mb-5 flex-row items-center"
          style={{ gap: 2, backgroundColor: `${typeColor}15`, borderWidth: 1, borderColor: `${typeColor}30` }}
        >
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: typeColor }} />
          <Text className="text-xs font-semibold capitalize" style={{ color: typeColor }}>
            {workout.type}
          </Text>
        </View>

        {/* ── Stats row ── */}
        <View className="flex-row mb-5" style={{ gap: 12 }}>
          <StatCard
            label="Duration"
            value={workout.duration ? `${workout.duration} min` : "—"}
          />
          <StatCard
            label="Calories"
            value={workout.calories ? `${workout.calories} kcal` : "—"}
          />
          <StatCard
            label="Exercises"
            value={exercises.length}
          />
        </View>

        {/* ── Notes ── */}
        {workout.notes && (
          <View className="bg-surface border border-border-default rounded-xl p-4 mb-5">
            <Text className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest mb-2">
              Notes
            </Text>
            <Text className="text-sm text-text-primary leading-relaxed">
              {workout.notes}
            </Text>
          </View>
        )}

        {/* ── Exercises ── */}
        <View className="bg-surface border border-border-default rounded-xl overflow-hidden mb-6">
          <View className="px-4 py-3 border-b border-border-default">
            <Text className="text-sm font-semibold text-text-primary">Exercises</Text>
          </View>

          <View style={{ gap: 12, padding: 12 }}>
            {exercises.length === 0 ? (
              <Text className="text-xs text-text-tertiary text-center py-4">
                No exercises logged.
              </Text>
            ) : (
              exercises.map((we: WorkoutExercise, i: number) => (
                <ExerciseRow key={we.id} we={we} index={i} />
              ))
            )}
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
};