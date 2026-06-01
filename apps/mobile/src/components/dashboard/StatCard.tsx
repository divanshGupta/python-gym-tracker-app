import { View, Text } from "react-native";

interface Props {
  value: string;
  label: string;
  accent?: boolean;
}

export const StatCard = ({ value, label, accent = false }: Props) => (
  <View className="flex-1 bg-surface rounded-md border border-border-default px-3 py-2.5">
    <Text
      style={{
        fontSize:      22,
        fontWeight:    "600",
        letterSpacing: -0.5,
        color:         accent ? "#7C5CFC" : "#FFFFFF",
        lineHeight:    26,
      }}
    >
      {value}
    </Text>
    <Text
      style={{ fontSize: 11, color: "#8E8E93", marginTop: 2 }}
    >
      {label}
    </Text>
  </View>
);