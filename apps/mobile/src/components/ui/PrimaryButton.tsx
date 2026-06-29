import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

interface PrimaryButtonProps {
  title: string;
  variant?: "primary" | "danger";
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
}

export const PrimaryButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
  textStyle,
  activeOpacity = 0.8,
}: PrimaryButtonProps) => {
  const bgClass =
    variant === "danger" ? "bg-red-500" : "bg-accent";

  return (
    <TouchableOpacity
      className={`h-12 rounded-xl items-center justify-center flex-row px-4 ${bgClass} ${
        disabled || loading ? "opacity-60" : ""
      }`}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white text-sm font-semibold" style={textStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
