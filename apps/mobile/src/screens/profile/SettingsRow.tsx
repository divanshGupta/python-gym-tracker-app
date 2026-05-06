import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

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
      ? { width: 10, height: 10, borderRadius: 5, backgroundColor: color }
      : shape === "rect"
      ? { width: 11, height: 7, borderRadius: 2, backgroundColor: color }
      : { width: 10, height: 10, borderRadius: 3, backgroundColor: color };

  return (
    <View
      style={{
        width: 30, height: 30, borderRadius: 8,
        backgroundColor: bg,
        alignItems: "center", justifyContent: "center",
        marginRight: 12,
      }}
    >
      <View style={inner} />
    </View>
  );
};

const Chevron = () => (
  <View
    style={{
      width: 7, height: 7,
      borderRightWidth: 1.5, borderTopWidth: 1.5,
      borderColor: "#636366",
      transform: [{ rotate: "45deg" }],
    }}
  />
);

export const SettingsRow = ({
  iconBg, iconColor, iconShape,
  label, rightElement, showChevron,
  onPress, isLast,
}: Props) => {
  const content = (
    <View
      className={`flex-row items-center px-3 py-3 ${!isLast ? "border-b border-border-default" : ""}`}
    >
      <Icon bg={iconBg} color={iconColor} shape={iconShape} />
      <Text className="text-text-primary text-sm flex-1">{label}</Text>
      {rightElement}
      {showChevron && <Chevron />}
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