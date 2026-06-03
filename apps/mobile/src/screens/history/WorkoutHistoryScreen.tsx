import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
// shared packages
import { useWorkouts, useDeleteWorkout } from "@gymtracker/hooks";
import type { Workout, WorkoutFilters, WorkoutType } from "@gymtracker/types";
import { tokens } from "../../theme/tokens";
// components
import {
  ScreenContainer, AppHeader, EmptyState
} from "../../components/ui";
import { WorkoutRow } from "../../components/dashboard/WorkoutRow";

// ── Constants ──────────────────────────────────────────────────────────────

const TYPES: { value: WorkoutType | ""; label: string }[] = [
  { value: "",            label: "All"         },
  { value: "strength",    label: "Strength"    },
  { value: "cardio",      label: "Cardio"      },
  { value: "flexibility", label: "Flexibility" },
  { value: "core",        label: "Core"        },
];
// ── Helpers ────────────────────────────────────────────────────────────────
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
          <View>
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
