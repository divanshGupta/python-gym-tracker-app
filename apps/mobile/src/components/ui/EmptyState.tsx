import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tokens } from "../../theme/tokens";

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

export const EmptyState = ({
  title,
  description,
  iconName = "barbell-outline",
  actionTitle,
  onActionPress,
}: EmptyStateProps) => {
  return (
    <View className="bg-surface border border-border-default rounded-xl p-8 items-center justify-center">
      <View className="w-12 h-12 bg-elevated border border-border-strong rounded-full items-center justify-center mb-4">
        <Ionicons name={iconName as any} size={22} color={tokens.colors.textSecondary} />
      </View>
      <Text className="text-text-primary text-sm font-semibold text-center mb-1">
        {title}
      </Text>
      <Text className="text-text-secondary text-xs text-center mb-4 leading-relaxed max-w-[85%]">
        {description}
      </Text>
      {actionTitle && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          className="bg-elevated border border-border-strong rounded-xl px-4 py-2.5"
          activeOpacity={0.7}
        >
          <Text className="text-text-primary text-xs font-semibold">
            {actionTitle}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
