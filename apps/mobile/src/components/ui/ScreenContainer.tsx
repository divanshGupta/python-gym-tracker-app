import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tokens } from "../../theme/tokens";

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  showsScrollIndicator?: boolean;
  refreshControl?: React.ReactElement<any>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  safeAreaTop?: boolean;
  safeAreaBottom?: boolean;
  keyboardAvoiding?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenContainer = ({
  children,
  scrollable = false,
  showsScrollIndicator = false,
  refreshControl,
  contentContainerStyle,
  loading = false,
  safeAreaTop = false,
  safeAreaBottom = false,
  keyboardAvoiding = true,
  style,
}: ScreenContainerProps) => {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: tokens.colors.void,
    paddingTop: safeAreaTop ? insets.top : 0,
    paddingBottom: safeAreaBottom ? insets.bottom : 0,
  };

  const content = scrollable ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsScrollIndicator}
      refreshControl={refreshControl}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>
  );

  const inner = loading ? (
    <View className="flex-1 items-center justify-center bg-void">
      <ActivityIndicator size="large" color={tokens.colors.accent} />
    </View>
  ) : (
    content
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={[containerStyle, style]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {inner}
      </KeyboardAvoidingView>
    );
  }

  return <View style={[containerStyle, style]}>{inner}</View>;
};
