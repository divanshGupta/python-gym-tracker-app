import React from "react";
import { View, Text, TextInput, TextInputProps, StyleProp, ViewStyle } from "react-native";
import { tokens } from "../../theme/tokens";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, rightElement, containerStyle, className = "", ...props }, ref) => {
    return (
      <View className="mb-4" style={containerStyle}>
        {label && (
          <Text className="text-2xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider px-0.5">
            {label}
          </Text>
        )}
        <View className="relative flex-row items-center">
          {leftIcon && (
            <View className="absolute left-4 z-10 items-center justify-center">
              {leftIcon}
            </View>
          )}
          <TextInput
            ref={ref}
            className={`bg-elevated border rounded-xl px-4 text-text-primary text-sm flex-1 ${
              leftIcon ? "pl-11" : ""
            } ${rightElement ? "pr-12" : ""} ${
              error ? "border-danger" : "border-border-default"
            } ${className}`}
            style={{ height: 48, color: tokens.colors.textPrimary }}
            placeholderTextColor={tokens.colors.textSecondary}
            autoCorrect={false}
            {...props}
          />
          {rightElement && (
            <View className="absolute right-4 items-center justify-center z-10">
              {rightElement}
            </View>
          )}
        </View>
        {error && (
          <Text className="text-danger text-2xs mt-1.5 px-0.5">
            {error}
          </Text>
        )}
      </View>
    );
  }
);
Input.displayName = "Input";
