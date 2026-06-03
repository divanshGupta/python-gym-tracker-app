//apps/mobile/src/screens/auth/RegisterScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@gymtracker/stores"; 
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { tokens } from "../../theme/tokens";
import { ScreenContainer, Input, PrimaryButton } from "../../components/ui";

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
const strengthColor = ["", "bg-danger", "bg-warning", "bg-accent", "bg-success"];

export const RegisterScreen = ({ navigation }: NativeStackScreenProps<any>) => {
  const { register, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const strength = getPasswordStrength(passwordValue);

  return (
    <ScreenContainer scrollable keyboardAvoiding safeAreaTop safeAreaBottom style={{ backgroundColor: tokens.colors.void }}>
      <View className="flex-1 px-6 pt-10 pb-6 justify-between">
        <View>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-6 self-start p-1 -ml-1"
          >
            <Text className="text-sm text-text-secondary font-semibold">← Back</Text>
          </TouchableOpacity>

          {/* Logo mark */}
          <View className="w-10 h-10 bg-accent rounded-xl items-center justify-center mb-8">
            <Text className="text-white font-bold text-lg">G</Text>
          </View>

          <Text className="text-2xl font-bold text-text-primary mb-1 tracking-tight">
            Create account
          </Text>
          <Text className="text-sm text-text-secondary mb-8">
            Start your fitness journey today
          </Text>

          {error && (
            <View className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 mb-6">
              <Text className="text-danger text-sm">{error}</Text>
            </View>
          )}

          {/* Username */}
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                placeholder="your_username"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.username?.message}
                autoCapitalize="none"
              />
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.email?.message}
                autoCapitalize="none"
              />
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-4">
                <Input
                  label="Password"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => {
                    onChange(text);
                    setPasswordValue(text);
                  }}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                  containerStyle={{ marginBottom: 0 }}
                  rightElement={
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="p-1"
                    >
                      <Text className="text-xs text-text-tertiary font-semibold">
                        {showPassword ? "Hide" : "Show"}
                      </Text>
                    </TouchableOpacity>
                  }
                />

                {/* Strength indicator */}
                {passwordValue.length > 0 && (
                  <View className="mt-2.5 px-0.5">
                    <View className="flex-row gap-1 mb-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <View
                          key={i}
                          className={`flex-1 h-1 rounded-full ${
                            i <= strength ? strengthColor[strength] : "bg-border-default"
                          }`}
                        />
                      ))}
                    </View>
                    <Text className="text-2xs font-semibold text-text-secondary uppercase">
                      Strength: <Text className="text-text-primary">{strengthLabel[strength]}</Text>
                    </Text>
                  </View>
                )}
              </View>
            )}
          />

          {/* CTA */}
          <PrimaryButton
            title="Create account"
            onPress={handleSubmit(register)}
            loading={isLoading}
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Footer */}
        <TouchableOpacity
          className="items-center mt-10"
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="text-sm text-text-secondary">
            Already have an account?{" "}
            <Text className="text-accent font-semibold">Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};