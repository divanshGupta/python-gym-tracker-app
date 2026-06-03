import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";

interface StatCardProps {
  value: string | number;
  label: string;
  unit?: string;
  accent?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const StatCard = ({
  value,
  label,
  unit,
  accent = false,
  style,
}: StatCardProps) => {
  return (
    <View
      className="flex-1 bg-surface rounded-xl border border-border-default px-4 py-3"
      style={style}
    >
      <Text className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">{label}</Text>
      <View className="flex-row items-baseline gap-0.5">
        <Text
          className={`text-[22px] font-bold ${
            accent ? "text-accent" : "text-text-primary"
          }`}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value === "--" ? "—" : value}
        </Text>
        {unit && value !== "--" && value !== "" && (
          <Text className="text-xs text-text-tertiary ml-0.5">{unit}</Text>
        )}
      </View>
    </View>
  );
};
