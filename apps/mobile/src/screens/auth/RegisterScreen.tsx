//apps/mobile/src/screens/RegisterScreen.tsx
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
  username: z.string().min(3, "Min 3 characters").max(20, "Max 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Need one uppercase letter")
    .regex(/[0-9]/, "Need one number"),
});
type FormData = z.infer<typeof schema>;

const getPasswordStrength = (password: string): number => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-400"];

export const RegisterScreen = ({ navigation }: NativeStackScreenProps<any>) => {
  const { register, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const strength = getPasswordStrength(passwordValue);

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

          <View>
            {/* Back */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mb-8 self-start"
            >
              <Text className="text-sm text-gray-400">← Back</Text>
            </TouchableOpacity>

            <View className="w-10 h-10 bg-indigo-600 rounded-xl items-center justify-center mb-8">
              <Text className="text-white font-bold text-lg">G</Text>
            </View>

            <Text className="text-2xl font-semibold text-gray-900 mb-1">
              Create account
            </Text>
            <Text className="text-sm text-gray-400 mb-8">
              Start your fitness journey today
            </Text>

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

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="mb-4">
                  <Text className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Email
                  </Text>
                  <TextInput
                    className={`bg-gray-50 border rounded-xl px-4 py-3.5 text-sm text-gray-900 ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="you@example.com"
                    placeholderTextColor="#9ca3af"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {errors.email && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.email.message}
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
                <View className="mb-4">
                  <Text className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                    Password
                  </Text>
                  <View className="relative">
                    <TextInput
                      className={`bg-gray-50 border rounded-xl px-4 py-3.5 text-sm text-gray-900 pr-12 ${
                        errors.password ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      placeholderTextColor="#9ca3af"
                      onChangeText={(text) => { onChange(text); setPasswordValue(text); }}
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

                  {/* Strength indicator */}
                  {passwordValue.length > 0 && (
                    <View className="mt-2">
                      <View className="flex-row gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <View
                            key={i}
                            className={`flex-1 h-1 rounded-full ${
                              i <= strength ? strengthColor[strength] : "bg-gray-100"
                            }`}
                          />
                        ))}
                      </View>
                      <Text className="text-xs text-gray-400">
                        {strengthLabel[strength]}
                      </Text>
                    </View>
                  )}

                  {errors.password && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* CTA */}
            <TouchableOpacity
              className={`bg-gray-900 rounded-xl py-4 items-center mt-2 ${
                isLoading ? "opacity-60" : ""
              }`}
              onPress={handleSubmit(register)}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white text-sm font-semibold">
                  Create account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <TouchableOpacity
            className="items-center mt-8"
            onPress={() => navigation.navigate("Login")}
          >
            <Text className="text-sm text-gray-400">
              Already have an account?{" "}
              <Text className="text-indigo-600 font-medium">Log in</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};