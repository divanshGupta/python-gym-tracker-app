import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useWorkoutSessionStore, type ActiveExercise } from "@gymtracker/stores";
import { tokens } from "../../theme/tokens";

interface Props { activeExercise: ActiveExercise; }

export const ActiveExerciseSection = ({ activeExercise }: Props) => {
  const { addSet, removeSet, updateSet, toggleSet, removeExercise } = useWorkoutSessionStore();
  const { localId, exercise, sets } = activeExercise;

  return (
    <View className="bg-surface rounded-md border border-border-default overflow-hidden">
      {/* Exercise header */}
      <View className="flex-row items-center px-3 py-2.5 border-b border-border-default">
        <Text className="text-text-primary text-sm font-semibold flex-1">
          {exercise.name}
        </Text>
        <Text
          className="text-xs font-medium px-2 py-1 rounded-sm mr-2 capitalize"
          style={{ color: "#9B7EFD", backgroundColor: "#2C1F5E" }}
        >
          {exercise.muscle_group}
        </Text>
        <TouchableOpacity onPress={() => removeExercise(localId)}>
          <Text className="text-text-tertiary text-xs">✕</Text>
        </TouchableOpacity>
      </View>

      {/* Column headers */}
      <View className="flex-row px-3 pt-2 pb-1">
        <Text className="text-text-tertiary text-2xs font-medium uppercase tracking-wide"
          style={{ width: 28 }}>Set</Text>
        <Text className="text-text-tertiary text-2xs font-medium uppercase tracking-wide flex-1 text-center">
          Reps
        </Text>
        <Text className="text-text-tertiary text-2xs font-medium uppercase tracking-wide flex-1 text-center">
          kg
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Sets */}
      {sets.map((s, i) => (
        <View
          key={s.id}
          className="flex-row items-center px-3 py-1.5 border-t border-border-default"
          style={{ backgroundColor: s.completed ? "#1A1A2E" : "transparent" }}
        >
          <Text className="text-text-tertiary text-xs text-center" style={{ width: 28 }}>
            {i + 1}
          </Text>
          <TextInput
            className="flex-1 mx-1 text-center text-text-primary text-sm rounded-sm py-1.5"
            style={{ backgroundColor: "#2C2C2E" }}
            placeholder="—"
            placeholderTextColor={tokens.colors.textTertiary}
            keyboardType="numeric"
            value={s.reps}
            onChangeText={(v) => updateSet(localId, s.id, "reps", v)}
          />
          <TextInput
            className="flex-1 mx-1 text-center text-text-primary text-sm rounded-sm py-1.5"
            style={{ backgroundColor: "#2C2C2E" }}
            placeholder="—"
            placeholderTextColor={tokens.colors.textTertiary}
            keyboardType="decimal-pad"
            value={s.weight}
            onChangeText={(v) => updateSet(localId, s.id, "weight", v)}
          />
          {/* Complete toggle */}
          <TouchableOpacity
            onPress={() => toggleSet(localId, s.id)}
            className="w-8 h-8 rounded-lg items-center justify-center"
            style={{
              backgroundColor: s.completed ? tokens.colors.accent : "#2C2C2E",
            }}
          >
            {s.completed && (
              <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      {/* Add set */}
      <TouchableOpacity
        className="px-3 py-2.5 border-t border-border-default"
        onPress={() => addSet(localId)}
      >
        <Text className="text-accent text-xs font-medium">+ Add set</Text>
      </TouchableOpacity>
    </View>
  );
};