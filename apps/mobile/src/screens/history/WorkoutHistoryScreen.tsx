import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, Alert, ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// shared packages
import { useWorkouts, useDeleteWorkout } from "@gymtracker/hooks";
import type { Workout, WorkoutFilters, WorkoutType } from "@gymtracker/types";
import { tokens } from "../../theme/tokens";
import {
  ScreenContainer, AppHeader, AppCard, EmptyState
} from "../../components/ui";

// ── Constants ──────────────────────────────────────────────────────────────

const TYPES: { value: WorkoutType | ""; label: string }[] = [
  { value: "",            label: "All"         },
  { value: "strength",    label: "Strength"    },
  { value: "cardio",      label: "Cardio"      },
  { value: "flexibility", label: "Flexibility" },
  { value: "core",        label: "Core"        },
];

// Left accent bar color per type
const getWorkoutColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "strength":
      return tokens.colors.accent;
    case "cardio":
      return tokens.colors.success;
    case "flexibility":
      return tokens.colors.warning;
    case "core":
      return tokens.colors.danger;
    default:
      return tokens.colors.textSecondary;
  }
};

// Icon background tint (10% opacity)
const getWorkoutBgColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "strength":
      return "#7C5CFC1A";
    case "cardio":
      return "#22C55E1A";
    case "flexibility":
      return "#F59E0B1A";
    case "core":
      return "#EF44441A";
    default:
      return "#8E8E931A";
  }
};

// Icon name per type
const getWorkoutIcon = (type: string): string => {
  switch (type.toLowerCase()) {
    case "cardio":
      return "heart-outline";
    case "flexibility":
      return "body-outline";
    case "core":
      return "fitness-outline";
    default:
      return "barbell-outline";
  }
};

// Badge text and bg styling per type
const getBadgeStyles = (type: string) => {
  switch (type.toLowerCase()) {
    case "strength":
      return { bg: "#7C5CFC1A", text: "#9B7EFD" };
    case "cardio":
      return { bg: "#22C55E1A", text: "#22C55E" };
    case "flexibility":
      return { bg: "#F59E0B1A", text: "#F59E0B" };
    case "core":
      return { bg: "#EF44441A", text: "#EF4444" };
    default:
      return { bg: "#8E8E931A", text: "#8E8E93" };
  }
};

// ── Helpers ────────────────────────────────────────────────────────────────

function relativeDay(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const today = new Date();
  const d = new Date(year, month - 1, day);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function workoutDisplayName(w: Workout): string {
  const exs = w.workout_exercises ?? [];
  if (exs.length === 0) {
    return w.type ? w.type.charAt(0).toUpperCase() + w.type.slice(1) : "Workout";
  }
  const first = exs[0].exercise.name;
  if (exs.length === 1) return first;
  if (exs.length === 2) return `${first} & ${exs[1].exercise.name}`;
  return `${first}, ${exs[1].exercise.name} +${exs.length - 2} more`;
}

const getPickerDate = (dateStr?: string): Date => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// ── Skeleton Placeholder ───────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <View className="flex-1 px-4 py-4 gap-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <View key={i} className="flex-row items-center bg-surface border border-border-default rounded-xl overflow-hidden h-20">
        <View className="w-[3.5px] h-full bg-border-default" />
        <View className="w-8 h-8 rounded-lg bg-elevated/40 mx-3" />
        <View className="flex-1 gap-1.5">
          <View className="w-32 h-4 bg-elevated/40 rounded-sm" />
          <View className="w-48 h-3 bg-elevated/35 rounded-sm" />
        </View>
      </View>
    ))}
  </View>
);

// ── Row Component ──────────────────────────────────────────────────────────

interface WorkoutRowProps {
  workout: Workout;
  onDelete: (id: number) => void;
  onPress: () => void;
}

const WorkoutRow = ({ workout: w, onDelete, onPress }: WorkoutRowProps) => {
  const type = w.type?.toLowerCase() ?? "strength";
  const accentColor = getWorkoutColor(type);
  const iconBg = getWorkoutBgColor(type);
  const badgeColors = getBadgeStyles(type);
  const name = workoutDisplayName(w);

  return (
    <AppCard
      onPress={onPress}
      activeOpacity={0.8}
      className="p-0 flex-row items-stretch overflow-hidden mb-2.5"
    >
      {/* Type accent bar */}
      <View style={{ width: 3.5, backgroundColor: accentColor }} />

      {/* Icon */}
      <View className="flex-row items-center justify-center w-12 flex-shrink-0 py-4">
        <View
          style={{ backgroundColor: iconBg }}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
        >
          <Ionicons name={getWorkoutIcon(type) as any} size={15} color={accentColor} />
        </View>
      </View>

      {/* Body */}
      <View className="flex-1 py-3 pr-2 min-w-0 justify-center">
        {/* Name + Badge */}
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-text-primary text-sm font-semibold truncate flex-1" numberOfLines={1}>
            {name}
          </Text>
          <View
            style={{ backgroundColor: badgeColors.bg }}
            className="px-2 py-0.5 rounded-full"
          >
            <Text
              style={{ color: badgeColors.text, fontSize: 9, letterSpacing: 0.8 }}
              className="font-semibold uppercase"
            >
              {w.type}
            </Text>
          </View>
        </View>

        {/* Meta row */}
        <View className="flex-row items-center flex-wrap gap-x-2.5 gap-y-1 mt-0.5">
          <View className="flex-row items-center gap-1">
            <Ionicons name="calendar-outline" size={11} color={tokens.colors.textTertiary} />
            <Text className="text-text-secondary text-2xs">{relativeDay(w.date)}</Text>
          </View>

          {w.duration && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={11} color={tokens.colors.textTertiary} />
              <Text className="text-text-secondary text-2xs">{w.duration} min</Text>
            </View>
          )}

          {w.calories && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="flame-outline" size={11} color={tokens.colors.textTertiary} />
              <Text className="text-text-secondary text-2xs">{w.calories} kcal</Text>
            </View>
          )}

          {w.workout_exercises?.length > 0 && (
            <Text className="text-text-tertiary text-2xs">
              · {w.workout_exercises.length} ex
            </Text>
          )}
        </View>

        {/* Notes */}
        {w.notes && (
          <Text
            className="text-text-tertiary text-2xs mt-1.5 truncate max-w-[90%]"
            numberOfLines={1}
          >
            {w.notes}
          </Text>
        )}
      </View>

      {/* Delete button */}
      <TouchableOpacity
        onPress={() => onDelete(w.id)}
        className="w-10 h-12 items-center justify-center mr-2 self-center"
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={15} color={tokens.colors.textTertiary} />
      </TouchableOpacity>
    </AppCard>
  );
};

// ── Screen Component ───────────────────────────────────────────────────────

export const WorkoutHistoryScreen = ({ navigation }: any) => {
  const [filters, setFilters] = useState<WorkoutFilters>({ page: 1, limit: 10 });
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const { data: workouts = [], isLoading, isRefetching, refetch } = useWorkouts(filters);
  const { mutate: deleteWorkout } = useDeleteWorkout();

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

  const handleFromChange = (event: any, selectedDate?: Date) => {
    setShowFromPicker(false);
    if (event.type === "set" && selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setFilters((f) => ({ ...f, date_from: formatted, page: 1 }));
    }
  };

  const handleToChange = (event: any, selectedDate?: Date) => {
    setShowToPicker(false);
    if (event.type === "set" && selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setFilters((f) => ({ ...f, date_to: formatted, page: 1 }));
    }
  };

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const canGoNext = workouts.length >= limit;
  const canGoPrev = page > 1;

  const hasDateFilter = !!(filters.date_from || filters.date_to);
  const hasFilter = !!(filters.type || hasDateFilter);

  const renderNewButton = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Log")}
      className="bg-accent rounded-xl px-3.5 py-2 flex-row items-center"
      activeOpacity={0.85}
    >
      <Ionicons name="add" size={15} color="#fff" />
      <Text className="text-white text-xs font-semibold">New</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />
      {/* Header */}
      <AppHeader
        title="Workouts"
        subtitle={
          workouts.length > 0
            ? `${workouts.length} session${workouts.length !== 1 ? "s" : ""} logged`
            : "Workout History"
        }
        rightElement={renderNewButton()}
        safeArea
      />

      <ScreenContainer
        scrollable
        contentContainerStyle={{ paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={tokens.colors.accent}
          />
        }
      >

        {/* Filter Bar */}
        <View className=" mb-4 gap-3">
          {/* Type Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
            className="py-1"
          >
            {TYPES.map(({ value, label }) => {
              const active = (filters.type ?? "") === value;
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() =>
                    setFilters((f) => ({
                      ...f,
                      type: (value as WorkoutType) || undefined,
                      page: 1,
                    }))
                  }
                  className={`px-4 py-2 rounded-xl border ${
                    active
                      ? "bg-elevated border-border-strong"
                      : "bg-surface border-border-default"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-[12px] font-medium ${
                      active ? "text-text-primary" : "text-text-tertiary"
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Date Picker Row */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setShowFromPicker(true)}
              className="flex-1 flex-row items-center justify-between bg-surface border border-border-default rounded-xl px-3.5 py-3"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={14} color={tokens.colors.textSecondary} />
                <Text className="text-text-secondary text-xs">
                  {filters.date_from ? `From: ${filters.date_from}` : "Start Date"}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowToPicker(true)}
              className="flex-1 flex-row items-center justify-between bg-surface border border-border-default rounded-xl px-3.5 py-3"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={14} color={tokens.colors.textSecondary} />
                <Text className="text-text-secondary text-xs">
                  {filters.date_to ? `To: ${filters.date_to}` : "End Date"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Clear & Stats Label */}
          {hasFilter && (
            <View className="flex-row items-center justify-between mt-1 px-1">
              <TouchableOpacity
                onPress={() => setFilters({ page: 1, limit: 10 })}
                className="flex-row items-center gap-1 py-1"
              >
                <Ionicons name="close-circle-outline" size={14} color={tokens.colors.accent} />
                <Text className="text-accent text-xs font-semibold">Clear Filters</Text>
              </TouchableOpacity>
              <Text className="text-text-tertiary text-xs font-medium">
                {workouts.length} found
              </Text>
            </View>
          )}
        </View>

        {/* List Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : workouts.length === 0 ? (
          <View className="">
            <EmptyState
              title="No workouts found"
              description={
                hasFilter
                  ? "Try adjusting your filters to find other logged workout sessions."
                  : "Begin logging your workouts to build your history and track progress."
              }
              actionTitle={hasFilter ? "Clear all filters" : "Log your first workout"}
              onActionPress={
                hasFilter
                  ? () => setFilters({ page: 1, limit: 10 })
                  : () => navigation.navigate("Log")
              }
            />
          </View>
        ) : (
          <View className="">
            {workouts.map((w: Workout) => (
              <WorkoutRow
                key={w.id}
                workout={w}
                onDelete={handleDelete}
                onPress={() => navigation.navigate("WorkoutDetail", { workoutId: w.id })}
              />
            ))}
          </View>
        )}

        {/* Pagination */}
        {!isLoading && workouts.length > 0 && (
          <View className="flex-row items-center justify-center gap-4 mt-4 px-4">
            <TouchableOpacity
              disabled={!canGoPrev}
              onPress={() => setFilters((f) => ({ ...f, page: page - 1 }))}
              className={`flex-row items-center gap-1.5 h-9 px-4 rounded-xl bg-surface border border-border-default ${
                !canGoPrev ? "opacity-35" : ""
              }`}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={13} color={tokens.colors.textSecondary} />
              <Text className="text-text-secondary text-xs font-semibold">Prev</Text>
            </TouchableOpacity>

            <Text className="text-text-tertiary text-xs font-semibold tabular-nums">
              Page {page}
            </Text>

            <TouchableOpacity
              disabled={!canGoNext}
              onPress={() => setFilters((f) => ({ ...f, page: page + 1 }))}
              className={`flex-row items-center gap-1.5 h-9 px-4 rounded-xl bg-surface border border-border-default ${
                !canGoNext ? "opacity-35" : ""
              }`}
              activeOpacity={0.7}
            >
              <Text className="text-text-secondary text-xs font-semibold">Next</Text>
              <Ionicons name="chevron-forward" size={13} color={tokens.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </ScreenContainer>

      {/* Date Pickers Render overlays */}
      {showFromPicker && (
        <DateTimePicker
          value={filters.date_from ? getPickerDate(filters.date_from) : new Date()}
          mode="date"
          display="default"
          onChange={handleFromChange}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={filters.date_to ? getPickerDate(filters.date_to) : new Date()}
          mode="date"
          display="default"
          onChange={handleToChange}
        />
      )}
    </View>
  );
};
