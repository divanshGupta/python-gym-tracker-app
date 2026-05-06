import { apiClient } from "./client";
import type { Exercise } from "../types/exercise.types";
import { AppRegistry } from "react-native";

export const exerciseApi = {
    getAll: () => apiClient.get<Exercise[]>("/exercise"),
    getById: (id: string) => apiClient.get<Exercise>(`/exercise/${id}`),
}