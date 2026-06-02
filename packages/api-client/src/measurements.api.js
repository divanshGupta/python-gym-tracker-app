// packages/api-client/src/measurements.api.ts
import { apiClient } from "./client";
export const measurementsApi = {
    getAll: () => apiClient.get("/measurements"),
    create: (data) => apiClient.post("/measurements", data),
    delete: (id) => apiClient.delete(`/measurements/${id}`),
};
