import React from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle } from "react-native";

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  className?: string;
}

export const AppCard = ({
  children,
  onPress,
  style,
  activeOpacity = 0.75,
  className = "",
}: AppCardProps) => {
  const cardClasses = `bg-surface rounded-xl p-4 border border-border-default ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        className={cardClasses}
        style={style}
        onPress={onPress}
        activeOpacity={activeOpacity}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={cardClasses} style={style}>
      {children}
    </View>
  );
};
