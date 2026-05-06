import React from "react";
import { View, Text } from "react-native";

interface Props {
  value: string;
  label: string;
  accent?: boolean;
}

export const StatCard = ({ value, label, accent = false }: Props) => (
  <View className="flex-1 bg-surface rounded-md border border-border-default p-3">
    <Text
      className="font-semibold"
      style={{
        fontSize: 24,
        letterSpacing: -0.5,
        color: accent ? "#7C5CFC" : "#FFFFFF",
      }}
    >
      {value}
    </Text>
    <Text className="text-text-secondary mt-0.5" style={{ fontSize: 11 }}>
      {label}
    </Text>
  </View>
);