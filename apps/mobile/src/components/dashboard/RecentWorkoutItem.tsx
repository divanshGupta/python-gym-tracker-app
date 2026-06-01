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

  // Top 2 exercise names — more informative than just "3 ex"
  const exercises = workout.workout_exercises ?? [];
  const topNames  = exercises
    .slice(0, 2)
    .map((e) => e.exercise?.name ?? "")
    .filter(Boolean);
  const remainder = exercises.length - topNames.length;

  return (
    <TouchableOpacity
      className={`flex-row items-center px-3 py-2.5 ${
        !isLast ? "border-b border-border-default" : ""
      }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View
        style={{
          width:           32,
          height:          32,
          borderRadius:    8,
          backgroundColor: "#2C2C2E",
          alignItems:      "center",
          justifyContent:  "center",
          marginRight:     10,
          flexShrink:      0,
        }}
      >
        <View style={{ width: 7, height: 7, borderRadius: 4,
                       backgroundColor: "#7C5CFC" }} />
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        {/* Title + time on same row */}
        <View className="flex-row items-center justify-between">
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#FFFFFF" }}>
            {title}
          </Text>
          <Text style={{ fontSize: 10, color: "#636366" }}>
            {formatDistanceToNow(new Date(workout.date), { addSuffix: true })}
          </Text>
        </View>

        {/* Exercise names row */}
        <View className="flex-row items-center mt-0.5">
          {topNames.length > 0 ? (
            <Text
              style={{ fontSize: 11, color: "#8E8E93" }}
              numberOfLines={1}
            >
              {topNames.join(" · ")}
              {remainder > 0 ? ` +${remainder} more` : ""}
            </Text>
          ) : (
            <Text style={{ fontSize: 11, color: "#636366" }}>
              {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
              {duration ? ` · ${duration}` : ""}
            </Text>
          )}

          {duration && topNames.length > 0 && (
            <Text style={{ fontSize: 11, color: "#636366", marginLeft: 6 }}>
              · {duration}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};