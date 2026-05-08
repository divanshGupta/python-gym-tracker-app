import { useState, useMemo } from "react";
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, Modal,
} from "react-native";
import { useExerciseStore } from "@gymtracker/stores";
import { useWorkoutSessionStore } from "@gymtracker/stores"; 
import { ExerciseCard } from "../exercise/ExerciseCard";
import { tokens } from "../../theme/tokens";
import type { Exercise } from "@gymtracker/types";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const ExercisePickerModal = ({ visible, onClose }: Props) => {
  const { exercises } = useExerciseStore();
  const { addExercise } = useWorkoutSessionStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() =>
    exercises.filter((e) => e.name.toLowerCase().includes(query.toLowerCase())),
    [exercises, query]
  );

  const handlePick = (exercise: Exercise) => {
    addExercise(exercise);
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-void">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 border-b border-border-default">
          <Text className="text-text-primary text-base font-semibold">
            Add exercise
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-accent text-sm">Done</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="px-4 py-3">
          <View className="flex-row items-center bg-surface border border-border-default rounded-md px-3" style={{ height: 42 }}>
            <Text className="text-text-tertiary mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-text-primary text-sm"
              placeholder="Search exercises..."
              placeholderTextColor={tokens.colors.textSecondary}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoFocus
            />
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 8 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => handlePick(item)}
              rightElement={
                <View className="bg-elevated rounded-sm px-2 py-1 ml-2">
                  <Text className="text-accent text-xs font-medium">Add</Text>
                </View>
              }
            />
          )}
        />
      </View>
    </Modal>
  );
};