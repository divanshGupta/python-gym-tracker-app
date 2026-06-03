import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";

interface SectionHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SectionHeader = ({
  title,
  rightElement,
  style,
}: SectionHeaderProps) => {
  return (
    <View
      className="flex-row items-center justify-between mb-2.5 px-0.5"
      style={style}
    >
      <Text className="text-2xs font-semibold text-text-tertiary uppercase tracking-wider">
        {title}
      </Text>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};
