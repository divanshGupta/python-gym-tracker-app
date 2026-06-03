import React from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { tokens } from "../../theme/tokens";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  border?: boolean;
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppHeader = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightElement,
  border = false,
  safeArea = false,
  style,
}: AppHeaderProps) => {
  const insets = useSafeAreaInsets();

  const headerStyle: ViewStyle = {
    paddingTop: safeArea ? insets.top + 12 : 12,
    paddingBottom: 12,
  };

  return (
    <View
      className={`px-4 flex-row items-center justify-between ${
        border ? "border-b border-border-default" : ""
      }`}
      style={[headerStyle, style]}
    >
      <View className="flex-row items-center flex-1 mr-4">
        {showBack && (
          <TouchableOpacity
            onPress={onBackPress}
            className="mr-3 p-1 -ml-1 rounded-lg"
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={tokens.colors.textPrimary}
            />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="text-text-primary text-xl font-bold tracking-tight">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-text-secondary text-xs mt-0.5" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};
