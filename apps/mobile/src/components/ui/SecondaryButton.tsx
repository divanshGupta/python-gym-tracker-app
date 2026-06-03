import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "outline" | "filled";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
}

export const SecondaryButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "filled",
  style,
  textStyle,
  activeOpacity = 0.8,
}: SecondaryButtonProps) => {
  const containerClasses =
    variant === "outline"
      ? "bg-transparent border border-border-strong"
      : "bg-surface border border-border-default";

  return (
    <TouchableOpacity
      className={`h-12 rounded-xl items-center justify-center flex-row px-4 ${containerClasses} ${
        disabled || loading ? "opacity-60" : ""
      }`}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
    >
      {loading ? (
        <ActivityIndicator color={tokens.colors.textSecondary} size="small" />
      ) : (
        <Text className="text-text-primary text-sm font-semibold" style={textStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
