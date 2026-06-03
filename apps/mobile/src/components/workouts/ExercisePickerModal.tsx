import { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { useExercises } from "@gymtracker/hooks"; 
import { useWorkoutSessionStore } from "@gymtracker/stores"; 
import { ExerciseCard } from "../exercise/ExerciseCard";
import { tokens } from "../../theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import type { Exercise } from "@gymtracker/types";
import { ScreenContainer, AppHeader, Input } from "../ui";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect?: (exercise: Exercise) => void;
}

export const ExercisePickerModal = ({ visible, onClose, onSelect }: Props) => {
  const { data: exercises = [] } = useExercises();
  const { addExercise } = useWorkoutSessionStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() =>
    exercises.filter((e) => e.name.toLowerCase().includes(query.toLowerCase())),
    [exercises, query]
  );

  const handlePick = (exercise: Exercise) => {
    if (onSelect) {
      onSelect(exercise);
    } else {
      addExercise(exercise);
    }
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScreenContainer keyboardAvoiding safeAreaTop safeAreaBottom style={{ backgroundColor: tokens.colors.void }}>
        {/* Header */}
        <AppHeader
          title="Add exercise"
          rightElement={
            <TouchableOpacity onPress={onClose}>
              <Text className="text-accent text-sm font-semibold">Done</Text>
            </TouchableOpacity>
          }
          border
        />

        {/* Search */}
        <Input
          placeholder="Search exercises..."
          value={query}
          onChangeText={setQuery}
          leftIcon={<Ionicons name="search-outline" size={16} color={tokens.colors.textSecondary} />}
          containerStyle={{ paddingHorizontal: 20, paddingTop: 16, marginBottom: 8 }}
        />

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={(e) => e.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => handlePick(item)}
              rightElement={
                <View className="bg-accent/15 px-3 py-1.5 rounded-full ml-2">
                  <Text className="text-accent text-3xs font-semibold uppercase tracking-wider">Add</Text>
                </View>
              }
            />
          )}
        />
      </ScreenContainer>
    </Modal>
  );
};