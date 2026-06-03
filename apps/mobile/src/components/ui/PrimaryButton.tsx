import React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
}

export const PrimaryButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  activeOpacity = 0.8,
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      className={`h-12 rounded-xl bg-accent items-center justify-center flex-row px-4 ${
        disabled || loading ? "opacity-60" : ""
      }`}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text className="text-white text-sm font-semibold" style={textStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
