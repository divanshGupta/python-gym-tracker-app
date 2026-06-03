// react-native/src/screens/exerciseLibraryScreen.tsx
import { useState, useMemo } from "react";
import {
  View, Text, FlatList, ScrollView,
  TouchableOpacity, StatusBar, ActivityIndicator, Modal, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useExercises, useCreateExercise } from "@gymtracker/hooks"; 
import { ExerciseCard } from "../../components/exercise/ExerciseCard";
import type { MuscleGroup, ExerciseCategory } from "@gymtracker/types";
import { tokens } from "../../theme/tokens";
import {
  ScreenContainer, AppHeader, Input, PrimaryButton
} from "../../components/ui";

const FILTERS: { label: string; value: MuscleGroup | "all" }[] = [
  { label: "All",       value: "all" },
  { label: "Chest",     value: "chest" },
  { label: "Back",      value: "back" },
  { label: "Legs",      value: "legs" },
  { label: "Arms",      value: "arms" },
  { label: "Shoulders", value: "shoulders" },
  { label: "Core",      value: "core" },
];

const CATEGORIES: ExerciseCategory[] = ["strength", "cardio", "flexibility", "core"];
const MUSCLE_GROUPS: MuscleGroup[] = ["chest", "back", "shoulders", "arms", "legs", "core", "full_body"];
const EQUIPMENT = ["barbell", "dumbbell", "bodyweight", "machine", "cable", "kettlebell", "none"];

export const ExerciseLibraryScreen = ({ navigation }: any) => {
  const { data: exercises = [], isLoading } = useExercises();
  const { mutate: createExercise, isPending } = useCreateExercise();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MuscleGroup | "all">("all");

  // Custom Exercise Creation Modal State
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<ExerciseCategory>("strength");
  const [newMuscleGroup, setNewMuscleGroup] = useState<MuscleGroup>("chest");
  const [newEquipment, setNewEquipment] = useState("none");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesQuery = ex.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = activeFilter === "all" || ex.muscle_group === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [exercises, query, activeFilter]);

  const resetForm = () => {
    setNewName("");
    setNewCategory("strength");
    setNewMuscleGroup("chest");
    setNewEquipment("none");
    setErrorMsg(null);
  };

  const handleCreateExercise = () => {
    setErrorMsg(null);

    if (!newName.trim() || newName.trim().length < 2) {
      setErrorMsg("Exercise name must be at least 2 characters");
      return;
    }

    const payload = {
      name: newName.trim().toLowerCase(),
      category: newCategory,
      muscle_group: newCategory === "strength" ? newMuscleGroup : null,
      equipment: newEquipment !== "none" ? newEquipment : null,
    };

    createExercise(payload, {
      onSuccess: () => {
        Alert.alert("Success", "Custom exercise added successfully!");
        setCreateModalVisible(false);
        resetForm();
      },
      onError: (err: any) => {
        setErrorMsg(err?.response?.data?.detail ?? "Failed to create exercise. It may already exist.");
      },
    });
  };

  const renderCustomButton = () => (
    <TouchableOpacity
      onPress={() => setCreateModalVisible(true)}
      className="bg-accent rounded-xl px-3.5 py-2 flex-row items-center"
      activeOpacity={0.85}
    >
      <Ionicons name="add" size={15} color="#fff" />
      <Text className="text-white text-xs font-semibold">Custom</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      {/* Header */}
      <AppHeader
        title="Exercises"
        rightElement={renderCustomButton()}
        safeArea
      />

      {/* Search Input */}
      <Input
        placeholder="Search exercises..."
        value={query}
        onChangeText={setQuery}
        leftIcon={<Ionicons name="search-outline" size={16} color={tokens.colors.textSecondary} />}
        rightElement={
          query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle-outline" size={16} color={tokens.colors.textTertiary} />
            </TouchableOpacity>
          ) : undefined
        }
        containerStyle={{ paddingHorizontal: 20 }}
      />

      {/* Filter chips container */}
      <View className="px-5 pb-3">
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(f) => f.value}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const active = activeFilter === item.value;
            return (
              <TouchableOpacity
                onPress={() => setActiveFilter(item.value)}
                className={`px-4 py-2 rounded-full border ${
                  active ? "bg-accent border-accent" : "bg-surface border-border-default"
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-xs font-semibold ${
                    active ? "text-white" : "text-text-secondary"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={tokens.colors.accent} />
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-text-secondary text-sm text-center">
            No exercises found for "{query}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(ex) => ex.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => navigation.navigate("ExerciseDetail", { exercise: item })}
            />
          )}
        />
      )}

      {/* Create Custom Exercise Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setCreateModalVisible(false);
          resetForm();
        }}
      >
        <ScreenContainer keyboardAvoiding safeAreaTop safeAreaBottom style={{ backgroundColor: tokens.colors.void }}>
          {/* Header */}
          <AppHeader
            title="New Custom Exercise"
            rightElement={
              <TouchableOpacity onPress={() => { setCreateModalVisible(false); resetForm(); }}>
                <Text className="text-accent text-sm font-semibold">Cancel</Text>
              </TouchableOpacity>
            }
            border
          />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
            {errorMsg && (
              <View className="mb-6 rounded-xl border border-danger/20 bg-danger/10 p-3">
                <Text className="text-sm text-danger">{errorMsg}</Text>
              </View>
            )}

            {/* Name Input */}
            <Input
              label="Exercise Name"
              placeholder="e.g. Incline Bench Press, Jogging"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />

            {/* Category Select */}
            <View className="mb-4">
              <Text className="text-2xs font-semibold text-text-secondary mb-2.5 uppercase tracking-wider px-0.5">Category</Text>
              <View className="flex-row flex-wrap">
                {CATEGORIES.map((c) => {
                  const active = newCategory === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setNewCategory(c)}
                      className={`px-4 py-2.5 rounded-xl border capitalize mb-2 mr-2 ${
                        active ? "bg-accent border-accent" : "bg-surface border-border-default"
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Muscle Group (Only for strength category) */}
            {newCategory === "strength" && (
              <View className="mb-4">
                <Text className="text-2xs font-semibold text-text-secondary mb-2.5 uppercase tracking-wider px-0.5">Muscle Group</Text>
                <View className="flex-row flex-wrap">
                  {MUSCLE_GROUPS.map((m) => {
                    const active = newMuscleGroup === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setNewMuscleGroup(m)}
                        className={`px-3.5 py-2 rounded-xl border capitalize mb-2 mr-2 ${
                          active ? "bg-accent border-accent" : "bg-surface border-border-default"
                        }`}
                        activeOpacity={0.8}
                      >
                        <Text className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>
                          {m.replace("_", " ")}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Equipment Select */}
            <View className="mb-6">
              <Text className="text-2xs font-semibold text-text-secondary mb-2.5 uppercase tracking-wider px-0.5">Equipment</Text>
              <View className="flex-row flex-wrap">
                {EQUIPMENT.map((eq) => {
                  const active = newEquipment === eq;
                  return (
                    <TouchableOpacity
                      key={eq}
                      onPress={() => setNewEquipment(eq)}
                      className={`px-3.5 py-2 rounded-xl border capitalize mb-2 mr-2 ${
                        active ? "bg-accent border-accent" : "bg-surface border-border-default"
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>
                        {eq}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit button */}
            <PrimaryButton
              title="Create Exercise"
              onPress={handleCreateExercise}
              loading={isPending}
            />
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </View>
  );
};