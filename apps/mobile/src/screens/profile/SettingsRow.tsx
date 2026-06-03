import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tokens } from "../../theme/tokens";

interface Props {
  iconBg: string;
  iconColor: string;
  iconShape: "square" | "circle" | "rect";
  label: string;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  isLast?: boolean;
}

const Icon = ({
  bg, color, shape,
}: { bg: string; color: string; shape: "square" | "circle" | "rect" }) => {
  const inner =
    shape === "circle"
      ? "w-2.5 h-2.5 rounded-full"
      : shape === "rect"
      ? "w-3 h-2 rounded-sm"
      : "w-2.5 h-2.5 rounded-sm";

  return (
    <View
      style={{ backgroundColor: bg }}
      className="w-8 h-8 rounded-lg items-center justify-center mr-3"
    >
      <View className={inner} style={{ backgroundColor: color }} />
    </View>
  );
};

export const SettingsRow = ({
  iconBg, iconColor, iconShape,
  label, rightElement, showChevron,
  onPress, isLast,
}: Props) => {
  const content = (
    <View
      className={`flex-row items-center px-4 py-3.5 ${!isLast ? "border-b border-border-default" : ""}`}
    >
      <Icon bg={iconBg} color={iconColor} shape={iconShape} />
      <Text className="text-text-primary text-sm font-medium flex-1">{label}</Text>
      {rightElement}
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={tokens.colors.textTertiary}
          className="ml-2"
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};