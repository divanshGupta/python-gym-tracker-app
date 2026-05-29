// react-native/src/screens/exerciseLibraryScreen.tsx
import React, { useState, useMemo } from "react";
import {
  View, Text, TextInput, FlatList, ScrollView,
  TouchableOpacity, StatusBar, ActivityIndicator, Modal, Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useExercises, useCreateExercise } from "@gymtracker/hooks"; 
import { useAuthStore } from "@gymtracker/stores";
import { ExerciseCard } from "../../components/exercise/ExerciseCard";
import type { MuscleGroup, ExerciseCategory } from "@gymtracker/types";
import { tokens } from "../../theme/tokens";

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
  const insets = useSafeAreaInsets();
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

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      {/* Header */}
      <View className="px-5" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-text-primary text-xl font-bold">
            Exercises
          </Text>
          <TouchableOpacity
            onPress={() => setCreateModalVisible(true)}
            className="bg-accent rounded-xl px-3.5 py-2 flex-row items-center"
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={15} color="#fff" className="mr-1" />
            <Text className="text-white text-xs font-semibold ml-1">Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-surface border border-border-default rounded-md px-3 mb-3" style={{ height: 42 }}>
          <Text className="text-text-tertiary mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-text-primary text-sm"
            placeholder="Search exercises..."
            placeholderTextColor={tokens.colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Text className="text-text-tertiary text-base px-1">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(f) => f.value}
          contentContainerStyle={{ gap: 6, paddingBottom: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item.value)}
              className="px-3 py-1.5 rounded-full mr-1.5"
              style={{
                backgroundColor:
                  activeFilter === item.value ? tokens.colors.accent : "#1C1C1E",
                borderWidth: 0.5,
                borderColor:
                  activeFilter === item.value ? tokens.colors.accent : "#2C2C2E",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: activeFilter === item.value ? "#fff" : tokens.colors.textSecondary,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
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
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, gap: 8 }}
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
        <View className="flex-1 bg-void p-5">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-border-default mb-4">
            <Text className="text-text-primary text-lg font-bold">New Custom Exercise</Text>
            <TouchableOpacity onPress={() => { setCreateModalVisible(false); resetForm(); }}>
              <Text className="text-accent text-sm font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {errorMsg && (
              <View className="mb-4 rounded-xl border border-danger/20 bg-danger/10 p-3">
                <Text className="text-sm text-danger">{errorMsg}</Text>
              </View>
            )}

            {/* Name */}
            <View className="mb-4">
              <Text className="text-text-secondary text-xs font-semibold mb-1.5 uppercase tracking-wider">Exercise Name</Text>
              <TextInput
                className="bg-surface border border-border-default rounded-xl px-4 py-3 text-text-primary text-sm font-medium"
                placeholder="e.g. Incline Bench Press, Jogging"
                placeholderTextColor={tokens.colors.textTertiary}
                value={newName}
                onChangeText={setNewName}
                autoFocus
              />
            </View>

            {/* Category */}
            <View className="mb-4">
              <Text className="text-text-secondary text-xs font-semibold mb-1.5 uppercase tracking-wider">Category</Text>
              <View className="flex-row flex-wrap">
                {CATEGORIES.map((c) => {
                  const active = newCategory === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setNewCategory(c)}
                      className="px-4 py-2.5 rounded-xl border capitalize mb-2 mr-2"
                      style={{
                        backgroundColor: active ? tokens.colors.accent : "#1C1C1E",
                        borderColor: active ? tokens.colors.accent : "#2C2C2E",
                      }}
                    >
                      <Text className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Muscle Group (Only for strength) */}
            {newCategory === "strength" && (
              <View className="mb-4">
                <Text className="text-text-secondary text-xs font-semibold mb-1.5 uppercase tracking-wider">Muscle Group</Text>
                <View className="flex-row flex-wrap">
                  {MUSCLE_GROUPS.map((m) => {
                    const active = newMuscleGroup === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setNewMuscleGroup(m)}
                        className="px-3.5 py-2 rounded-xl border capitalize mb-2 mr-2"
                        style={{
                          backgroundColor: active ? tokens.colors.accent : "#1C1C1E",
                          borderColor: active ? tokens.colors.accent : "#2C2C2E",
                        }}
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

            {/* Equipment */}
            <View className="mb-6">
              <Text className="text-text-secondary text-xs font-semibold mb-1.5 uppercase tracking-wider">Equipment</Text>
              <View className="flex-row flex-wrap">
                {EQUIPMENT.map((eq) => {
                  const active = newEquipment === eq;
                  return (
                    <TouchableOpacity
                      key={eq}
                      onPress={() => setNewEquipment(eq)}
                      className="px-3.5 py-2 rounded-xl border capitalize mb-2 mr-2"
                      style={{
                        backgroundColor: active ? tokens.colors.accent : "#1C1C1E",
                        borderColor: active ? tokens.colors.accent : "#2C2C2E",
                      }}
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
            <TouchableOpacity
              onPress={handleCreateExercise}
              disabled={isPending}
              className="bg-accent rounded-xl py-4 items-center"
              activeOpacity={0.85}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white text-sm font-semibold">Create Exercise</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};