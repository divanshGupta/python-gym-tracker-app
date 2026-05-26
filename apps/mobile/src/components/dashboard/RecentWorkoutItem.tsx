import { View, Text, TouchableOpacity } from "react-native";
import { formatDistanceToNow } from "date-fns";
import type { Workout } from "@gymtracker/types"; 

interface Props {
  workout: Workout;
  isLast: boolean;
  onPress: () => void;
}

const getDuration = (w: Workout): string => {
  if (w.duration === null || w.duration === undefined) return "In progress";
  return `${w.duration} min`;
};

export const RecentWorkoutItem = ({ workout, isLast, onPress }: Props) => {
  const title = workout.type ? workout.type.charAt(0).toUpperCase() + workout.type.slice(1) : "Workout";
  return (
    <TouchableOpacity
      className={`flex-row items-center px-3 py-3 ${!isLast ? "border-b border-border-default" : ""}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon dot */}
      <View className="w-8 h-8 rounded-lg bg-elevated items-center justify-center mr-3">
        <View
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: "#7C5CFC" }}
        />
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-text-primary text-sm font-medium">{title}</Text>
        <Text className="text-text-secondary mt-0.5" style={{ fontSize: 11 }}>
          {formatDistanceToNow(new Date(workout.date), { addSuffix: true })}
          {" · "}
          {getDuration(workout)}
        </Text>
      </View>

      {/* Badge */}
      <View className="bg-elevated rounded-sm px-2 py-1 ml-2">
        <Text className="text-text-secondary" style={{ fontSize: 10, fontWeight: "500" }}>
          {(workout.workout_exercises ?? []).length} ex
        </Text>
      </View>
    </TouchableOpacity>
  );
};