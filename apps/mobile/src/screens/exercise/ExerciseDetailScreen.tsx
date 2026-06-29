import React, { useState, useEffect } from "react";
import { View, Text, Alert, ActivityIndicator, Modal, ScrollView, TouchableOpacity } from "react-native";
import { useExercise, useDeleteExercise, useUpdateExercise } from "@gymtracker/hooks";
import { ScreenContainer, AppHeader, AppCard, PrimaryButton, SecondaryButton, Input } from "../../components/ui";
import { tokens } from "../../theme/tokens";
import type { MuscleGroup, ExerciseCategory } from "@gymtracker/types";

const CATEGORIES: ExerciseCategory[] = ["strength", "cardio", "flexibility", "core"];
const MUSCLE_GROUPS: MuscleGroup[] = ["chest", "back", "shoulders", "arms", "legs", "core", "full_body"];
const EQUIPMENT = ["barbell", "dumbbell", "bodyweight", "machine", "cable", "kettlebell", "none"];

export const ExerciseDetailScreen = ({ route, navigation }: any) => {
  const { exercise } = route.params;
  const { data: detail, isLoading } = useExercise(exercise.id);
  const { mutate: deleteExercise, isPending: isDeleting } = useDeleteExercise();
  const { mutate: updateExercise, isPending: isUpdating } = useUpdateExercise();

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<ExerciseCategory>("strength");
  const [editMuscleGroup, setEditMuscleGroup] = useState<MuscleGroup>("chest");
  const [editEquipment, setEditEquipment] = useState("none");
  const [editDescription, setEditDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize edit form values when details load or modal opens
  useEffect(() => {
    if (detail) {
      setEditName(detail.name);
      setEditCategory(detail.category);
      setEditMuscleGroup((detail.muscle_group as MuscleGroup) ?? "chest");
      setEditEquipment(detail.equipment ?? "none");
      setEditDescription(detail.description ?? "");
    }
  }, [detail, editModalVisible]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Exercise",
      `Are you sure you want to delete "${detail?.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteExercise(exercise.id, {
              onSuccess: () => {
                Alert.alert("Success", "Exercise deleted successfully.");
                navigation.goBack();
              }
            });
          }
        }
      ]
    );
  };

  const handleUpdate = () => {
    setErrorMsg(null);
    if (!editName.trim() || editName.trim().length < 2) {
      setErrorMsg("Exercise name must be at least 2 characters");
      return;
    }

    const payload = {
      name: editName.trim().toLowerCase(),
      category: editCategory,
      muscle_group: editCategory === "strength" ? editMuscleGroup : null,
      equipment: editEquipment !== "none" ? editEquipment : null,
      description: editDescription.trim() || null,
    };

    updateExercise(
      { id: exercise.id, data: payload },
      {
        onSuccess: () => {
          Alert.alert("Success", "Exercise updated successfully!");
          setEditModalVisible(false);
        },
        onError: (err: any) => {
          setErrorMsg(err?.response?.data?.detail ?? "Failed to update exercise.");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-void items-center justify-center">
        <ActivityIndicator color={tokens.colors.accent} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-void">
      <AppHeader title="Exercise Details" safeArea border />
      <ScreenContainer scrollable contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-bold text-text-primary capitalize mb-4">{detail?.name}</Text>
        
        {/* Stats row — equal width, label-over-value like web */}
        <View className="flex-row gap-2 mb-4">
          {[
            ["Category", detail?.category],
            ["Muscle Group", detail?.muscle_group],
            ["Equipment", detail?.equipment],
          ].map(([label, value]) => (
            <AppCard key={label} style={{ flex: 1 }} className="items-center p-3">
              <Text className="text-xs uppercase text-text-tertiary mb-1">{label}</Text>
              <Text className="text-text-primary font-semibold">{value ?? "—"}</Text>
            </AppCard>
          ))}
        </View>

        {detail?.description && (
          <AppCard className="mb-4">
            <Text className="text-2xs font-semibold text-text-tertiary uppercase">Notes</Text>
            <Text className="text-sm text-text-secondary mt-1">{detail.description}</Text>
          </AppCard>
        )}

        {detail?.is_custom && (
          <View className="flex-row mt-4" style={{ gap: 12 }}>
            <SecondaryButton 
              title="Edit" 
              style={{ flex: 1 }}
              onPress={() => setEditModalVisible(true)} 
            />
            <PrimaryButton 
              title="Delete" 
              style={{ flex: 1, backgroundColor: tokens.colors.danger }}
              loading={isDeleting}
              onPress={handleDelete}
            />
          </View>
        )}
      </ScreenContainer>

      {/* Edit Exercise Modal (Directly integrated inside details screen) */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <ScreenContainer keyboardAvoiding safeAreaTop safeAreaBottom style={{ backgroundColor: tokens.colors.void }}>
          <AppHeader
            title="Edit Exercise"
            rightElement={
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
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

            <Input
              label="Exercise Name"
              placeholder="e.g. Incline Bench Press"
              value={editName}
              onChangeText={setEditName}
            />

            {/* Category Select (Chips) */}
            <View className="mb-4">
              <Text className="text-2xs font-semibold text-text-secondary mb-2.5 uppercase tracking-wider px-0.5">Category</Text>
              <View className="flex-row flex-wrap">
                {CATEGORIES.map((c) => {
                  const active = editCategory === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setEditCategory(c)}
                      className={`px-4 py-2.5 rounded-xl border capitalize mb-2 mr-2 ${
                        active ? "bg-accent border-accent" : "bg-surface border-border-default"
                      }`}
                    >
                      <Text className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>{c}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Muscle Group Select (Chips) */}
            {editCategory === "strength" && (
              <View className="mb-4">
                <Text className="text-2xs font-semibold text-text-secondary mb-2.5 uppercase tracking-wider px-0.5">Muscle Group</Text>
                <View className="flex-row flex-wrap">
                  {MUSCLE_GROUPS.map((m) => {
                    const active = editMuscleGroup === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setEditMuscleGroup(m)}
                        className={`px-3.5 py-2 rounded-xl border capitalize mb-2 mr-2 ${
                          active ? "bg-accent border-accent" : "bg-surface border-border-default"
                        }`}
                      >
                        <Text className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>{m.replace("_", " ")}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Equipment Select (Chips) */}
            <View className="mb-4">
              <Text className="text-2xs font-semibold text-text-secondary mb-2.5 uppercase tracking-wider px-0.5">Equipment</Text>
              <View className="flex-row flex-wrap">
                {EQUIPMENT.map((eq) => {
                  const active = editEquipment === eq;
                  return (
                    <TouchableOpacity
                      key={eq}
                      onPress={() => setEditEquipment(eq)}
                      className={`px-3.5 py-2 rounded-xl border capitalize mb-2 mr-2 ${
                        active ? "bg-accent border-accent" : "bg-surface border-border-default"
                      }`}
                    >
                      <Text className={`text-xs font-semibold ${active ? "text-white" : "text-text-secondary"}`}>{eq}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Input
              label="Notes / Description"
              placeholder="Provide a detailed instructions or tips..."
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />

            <PrimaryButton
              title="Save Changes"
              onPress={handleUpdate}
              loading={isUpdating}
            />
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </View>
  );
};