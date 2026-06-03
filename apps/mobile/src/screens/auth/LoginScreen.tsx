//apps/mobile/src/screens/auth/LoginScreen.tsx
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@gymtracker/stores"; 
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { tokens } from "../../theme/tokens";
import { ScreenContainer, Input, PrimaryButton, SecondaryButton } from "../../components/ui";

const schema = z.object({
  email: z.string().email("Invalid email address"),
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
    <ScreenContainer scrollable keyboardAvoiding safeAreaTop safeAreaBottom style={{ backgroundColor: tokens.colors.void }}>
      <View className="flex-1 px-6 pt-16 pb-6 justify-between">
        <View>
          {/* Logo mark */}
          <View className="w-10 h-10 bg-accent rounded-xl items-center justify-center mb-8">
            <Text className="text-white font-bold text-lg">G</Text>
          </View>

          <Text className="text-2xl font-bold text-text-primary mb-1 tracking-tight">
            Welcome back
          </Text>
          <Text className="text-sm text-text-secondary mb-8">
            Log in to continue tracking
          </Text>

          {/* Error banner */}
          {error && (
            <View className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 mb-6">
              <Text className="text-danger text-sm">{error}</Text>
            </View>
          )}

          {/* Email / Username */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.password?.message}
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
            )}
          />

          {/* Forgot password */}
          <TouchableOpacity className="self-end mb-6">
            <Text className="text-xs text-accent font-semibold">Forgot password?</Text>
          </TouchableOpacity>

          {/* CTA */}
          <PrimaryButton
            title="Log in"
            onPress={handleSubmit(login)}
            loading={isLoading}
            style={{ marginBottom: 16 }}
          />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border-default" />
            <Text className="text-xs text-text-tertiary mx-3">or</Text>
            <View className="flex-1 h-px bg-border-default" />
          </View>

          {/* Google */}
          <SecondaryButton
            title="Continue with Google"
            onPress={() => {}}
            variant="filled"
          />
        </View>

        {/* Footer */}
        <TouchableOpacity
          className="items-center mt-10"
          onPress={() => navigation.navigate("Register")}
        >
          <Text className="text-sm text-text-secondary">
            No account?{" "}
            <Text className="text-accent font-semibold">Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};