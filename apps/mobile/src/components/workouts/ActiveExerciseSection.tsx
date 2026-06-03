import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useWorkoutSessionStore, type ActiveExercise } from "@gymtracker/stores";
import { tokens } from "../../theme/tokens";
import { AppCard } from "../ui";

interface Props { activeExercise: ActiveExercise; }

export const ActiveExerciseSection = ({ activeExercise }: Props) => {
  const { addSet, removeSet, updateSet, toggleSet, removeExercise } = useWorkoutSessionStore();
  const { localId, exercise, sets } = activeExercise;

  return (
    <AppCard className="p-0 overflow-hidden mb-4">
      {/* Exercise header */}
      <View className="flex-row items-center px-4 py-3 border-b border-border-default bg-elevated/10">
        <Text className="text-text-primary text-sm font-semibold flex-1 capitalize">
          {exercise.name}
        </Text>
        <Text
          className="text-3xs font-semibold px-2.5 py-1 rounded-full mr-3 capitalize"
          style={{ color: "#9B7EFD", backgroundColor: "#2C1F5E" }}
        >
          {exercise.muscle_group}
        </Text>
        <TouchableOpacity onPress={() => removeExercise(localId)} className="p-1 -mr-1">
          <Text className="text-text-tertiary text-sm font-bold">✕</Text>
        </TouchableOpacity>
      </View>

      {/* Column headers */}
      <View className="flex-row px-4 pt-2.5 pb-1">
        <Text className="text-text-tertiary text-3xs font-semibold uppercase tracking-wider text-center"
          style={{ width: 32 }}>Set</Text>
        <Text className="text-text-tertiary text-3xs font-semibold uppercase tracking-wider flex-1 text-center">
          Reps
        </Text>
        <Text className="text-text-tertiary text-3xs font-semibold uppercase tracking-wider flex-1 text-center">
          kg
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Sets list */}
      {sets.map((s, i) => (
        <View
          key={s.id}
          className="flex-row items-center px-4 py-2 border-t border-border-default"
          style={{ backgroundColor: s.completed ? "rgba(124, 92, 252, 0.05)" : "transparent" }}
        >
          <Text className="text-text-secondary text-xs font-semibold text-center" style={{ width: 32 }}>
            {i + 1}
          </Text>
          <TextInput
            className="flex-1 mx-1.5 text-center text-text-primary text-sm rounded-xl py-2 bg-elevated border border-border-default font-semibold"
            placeholder="—"
            placeholderTextColor={tokens.colors.textTertiary}
            keyboardType="numeric"
            value={s.reps}
            onChangeText={(v) => updateSet(localId, s.id, "reps", v)}
          />
          <TextInput
            className="flex-1 mx-1.5 text-center text-text-primary text-sm rounded-xl py-2 bg-elevated border border-border-default font-semibold"
            placeholder="—"
            placeholderTextColor={tokens.colors.textTertiary}
            keyboardType="decimal-pad"
            value={s.weight}
            onChangeText={(v) => updateSet(localId, s.id, "weight", v)}
          />
          {/* Complete toggle */}
          <TouchableOpacity
            onPress={() => toggleSet(localId, s.id)}
            className="w-8 h-8 rounded-xl items-center justify-center ml-1.5"
            style={{
              backgroundColor: s.completed ? tokens.colors.accent : tokens.colors.elevated,
              borderWidth: s.completed ? 0 : 1,
              borderColor: tokens.colors.borderDefault,
            }}
            activeOpacity={0.7}
          >
            {s.completed && (
              <Text className="text-white font-bold text-xs">✓</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      {/* Add set button */}
      <TouchableOpacity
        className="px-4 py-3.5 border-t border-border-default items-center bg-elevated/5"
        onPress={() => addSet(localId)}
        activeOpacity={0.7}
      >
        <Text className="text-accent text-xs font-semibold uppercase tracking-wider">+ Add set</Text>
      </TouchableOpacity>
    </AppCard>
  );
};