import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { MuscleGroup, Exercise } from "@gymtracker/types"; 

const MUSCLE_CONFIG: Record<MuscleGroup, { bg: string; color: string; dot: string }> = {
  chest:     { bg: "#2C1F5E", color: "#9B7EFD", dot: "#7C5CFC" },
  back:      { bg: "#1A2E1A", color: "#4ADE80", dot: "#22C55E" },
  legs:      { bg: "#2A2010", color: "#FCD34D", dot: "#F59E0B" },
  arms:      { bg: "#2E1A22", color: "#F472B6", dot: "#EC4899" },
  shoulders: { bg: "#1A2030", color: "#60A5FA", dot: "#3B82F6" },
  core:      { bg: "#1C1C2E", color: "#8E8E93", dot: "#636366" },
  full_body: { bg: "#1C2A1C", color: "#86EFAC", dot: "#4ADE80" },
};

interface Props {
  exercise: Exercise;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export const ExerciseCard = ({ exercise, onPress, rightElement }: Props) => {
  const muscleGroup = (exercise.muscle_group ?? "core") as MuscleGroup;
  const config = MUSCLE_CONFIG[muscleGroup] ?? MUSCLE_CONFIG.core;

  return (
    <TouchableOpacity
      className="bg-surface rounded-md border border-border-default p-3 flex-row items-center"
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Icon */}
      <View
        className="w-9 h-9 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: config.bg }}
      >
        <View
          className="w-2.5 h-2.5 rounded-sm"
          style={{ backgroundColor: config.dot }}
        />
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-text-primary text-sm font-medium">{exercise.name}</Text>
        <Text className="text-text-secondary mt-0.5 capitalize" style={{ fontSize: 11 }}>
          {exercise.equipment} · {exercise.category}
        </Text>
      </View>

      {/* Right — tag or custom element */}
      {rightElement ?? (
        <View
          className="px-2 py-1 rounded-sm ml-2"
          style={{ backgroundColor: config.bg }}
        >
          <Text style={{ fontSize: 10, fontWeight: "500", color: config.color }}>
            {muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};