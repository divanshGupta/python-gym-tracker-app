// react-native/src/screens/exerciseLibraryScreen.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, StatusBar, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useExerciseStore } from "@gymtracker/stores";
import { useAuthStore } from "@gymtracker/stores";
import { ExerciseCard } from "../../components/exercise/ExerciseCard";
import type { MuscleGroup } from "@gymtracker/types";
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

export const ExerciseLibraryScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { exercises, isLoading, fetchExercises } = useExerciseStore();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MuscleGroup | "all">("all");

  useEffect(() => { fetchExercises(); }, []);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesQuery = ex.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = activeFilter === "all" || ex.muscle_group === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [exercises, query, activeFilter]);

  return (
    <View className="flex-1 bg-void">
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.void} />

      {/* Header */}
      <View className="px-5" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-text-primary text-lg font-semibold mb-4">
          Exercises
        </Text>

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
              className="px-3 py-1.5 rounded-full"
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
          keyExtractor={(ex) => ex.id}
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
    </View>
  );
};