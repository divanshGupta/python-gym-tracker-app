import { View, Text, TouchableOpacity } from "react-native";
import { formatDistanceToNow } from "date-fns";
import type { Workout } from "@gymtracker/types";

interface Props {
  workout: Workout;
  isLast:  boolean;
  onPress: () => void;
}

const getDuration = (w: Workout): string => {
  if (w.duration == null) return "";
  return `${w.duration} min`;
};

export const RecentWorkoutItem = ({ workout, isLast, onPress }: Props) => {
  const title = workout.type
    ? workout.type.charAt(0).toUpperCase() + workout.type.slice(1)
    : "Workout";

  const duration = getDuration(workout);

  const exercises = workout.workout_exercises ?? [];
  const topNames  = exercises
    .slice(0, 2)
    .map((e) => e.exercise?.name ?? "")
    .filter(Boolean);
  const remainder = exercises.length - topNames.length;

  return (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-3.5 ${
        !isLast ? "border-b border-border-default" : ""
      }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon with Accent Dot */}
      <View
        className="w-9 h-9 rounded-lg bg-elevated items-center justify-center mr-3 flex-shrink-0"
      >
        <View className="w-2.5 h-2.5 rounded-full bg-accent" />
      </View>

      {/* Info */}
      <View className="flex-1">
        {/* Title + time row */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-text-primary">
            {title}
          </Text>
          <Text className="text-2xs text-text-tertiary">
            {formatDistanceToNow(new Date(workout.date), { addSuffix: true })}
          </Text>
        </View>

        {/* Exercise names row */}
        <View className="flex-row items-center mt-1 flex-wrap">
          {topNames.length > 0 ? (
            <Text
              className="text-xs text-text-secondary"
              numberOfLines={1}
            >
              {topNames.join(" · ")}
              {remainder > 0 ? ` +${remainder} more` : ""}
            </Text>
          ) : (
            <Text className="text-xs text-text-tertiary">
              {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
              {duration ? ` · ${duration}` : ""}
            </Text>
          )}

          {duration && topNames.length > 0 && (
            <Text className="text-xs text-text-tertiary ml-1.5">
              · {duration}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};