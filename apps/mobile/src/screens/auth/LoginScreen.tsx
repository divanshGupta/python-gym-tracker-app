import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@gymtracker/stores"; 
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Minimum 6 characters"),
});
type FormData = z.infer<typeof schema>;

export const LoginScreen = ({ navigation }: NativeStackScreenProps<any>) => {
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-20 pb-10 justify-between">

          {/* Header */}
          <View>
            {/* Logo mark */}
            <View className="w-10 h-10 bg-indigo-600 rounded-xl items-center justify-center mb-8">
              <Text className="text-white font-bold text-lg">G</Text>
            </View>

            <Text className="text-2xl font-semibold text-gray-900 mb-1">
              Welcome back
            </Text>
            <Text className="text-sm text-gray-400 mb-8">
              Log in to continue tracking
            </Text>

            {/* Error banner */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            )}

            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-4">
                  <Text className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Username
                  </Text>
                  <TextInput
                    className={`bg-gray-50 border rounded-xl px-4 py-3.5 text-sm text-gray-900 ${
                      errors.username ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="your_username"
                    placeholderTextColor="#9ca3af"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.username && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.username.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-2">
                  <Text className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Password
                  </Text>
                  <View className="relative">
                    <TextInput
                      className={`bg-gray-50 border rounded-xl px-4 py-3.5 text-sm text-gray-900 pr-12 ${
                        errors.password ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="••••••••"
                      placeholderTextColor="#9ca3af"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-3.5"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text className="text-xs text-gray-400">
                        {showPassword ? "Hide" : "Show"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <TouchableOpacity className="self-end mb-6">
              <Text className="text-xs text-indigo-600">Forgot password?</Text>
            </TouchableOpacity>

            {/* CTA */}
            <TouchableOpacity
              className={`bg-gray-900 rounded-xl py-4 items-center ${
                isLoading ? "opacity-60" : ""
              }`}
              onPress={handleSubmit(login)}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white text-sm font-semibold">Log in</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-5">
              <View className="flex-1 h-px bg-gray-100" />
              <Text className="text-xs text-gray-300 mx-3">or</Text>
              <View className="flex-1 h-px bg-gray-100" />
            </View>

            {/* Google (wired up when ready) */}
            <TouchableOpacity
              className="border border-gray-200 rounded-xl py-3.5 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-sm text-gray-600">Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <TouchableOpacity
            className="items-center mt-8"
            onPress={() => navigation.navigate("Register")}
          >
            <Text className="text-sm text-gray-400">
              No account?{" "}
              <Text className="text-indigo-600 font-medium">Sign up</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};