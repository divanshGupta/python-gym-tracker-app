import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

interface SectionProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export const Section = ({ children, style, className = "" }: SectionProps) => {
  return (
    <View className={`mb-6 ${className}`} style={style}>
      {children}
    </View>
  );
};
