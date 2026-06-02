// packages/api-client/src/exercises.api.ts
import { apiClient } from "./client";
export const exercisesApi = {
    // GET /exercises  →  optional ?category= filter
    getAll: (category) => apiClient.get("/exercises", {
        params: category ? { category } : undefined,
    }),
    // GET /exercises/:id 
    getById: (id) => apiClient.get(`/exercises/${id}`),
    // POST /exercise
    create: (data) => apiClient.post("/exercises", data),
};
