import { apiClient } from "./client";
import type { Exercise } from "../../apps/mobile/src/types/exercise.types";

export const exerciseApi = {
    getAll: () => apiClient.get<Exercise[]>("/exercise"),
    getById: (id: string) => apiClient.get<Exercise>(`/exercise/${id}`),
}