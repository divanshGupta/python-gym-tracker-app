import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { formatDistanceToNow } from "date-fns";
import type { Workout } from "../../types/workout.types";

interface Props {
  workout: Workout;
  isLast: boolean;
  onPress: () => void;
}

const getDuration = (w: Workout): string => {
  if (!w.completed_at) return "In progress";
  const mins = Math.round(
    (new Date(w.completed_at).getTime() - new Date(w.started_at).getTime()) / 60000
  );
  return `${mins} min`;
};

export const RecentWorkoutItem = ({ workout, isLast, onPress }: Props) => (
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
      <Text className="text-text-primary text-sm font-medium">{workout.name}</Text>
      <Text className="text-text-secondary mt-0.5" style={{ fontSize: 11 }}>
        {formatDistanceToNow(new Date(workout.started_at), { addSuffix: true })}
        {" · "}
        {getDuration(workout)}
      </Text>
    </View>

    {/* Badge */}
    <View className="bg-elevated rounded-sm px-2 py-1 ml-2">
      <Text className="text-text-secondary" style={{ fontSize: 10, fontWeight: "500" }}>
        {workout.exercises.length} ex
      </Text>
    </View>
  </TouchableOpacity>
);