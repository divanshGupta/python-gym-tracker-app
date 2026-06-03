import {
  View, Text, TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// shared packages
import { useWorkouts, useDeleteWorkout } from "@gymtracker/hooks";
import type { Workout, WorkoutType } from "@gymtracker/types";
import { tokens } from "../../theme/tokens";
import {
  AppCard
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

interface WorkoutRowProps {
  workout: Workout;
  onDelete: (id: number) => void;
  onPress: () => void;
}

export const WorkoutRow = ({ workout: w, onDelete, onPress }: WorkoutRowProps) => {
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