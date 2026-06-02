import { apiClient } from "./client";
export const goalsApi = {
    // GET /goals?status=active
    getAll: (status) => apiClient.get("/goals", {
        params: status ? { status } : undefined,
    }),
    // GET /goals/:id
    getById: (id) => apiClient.get(`/goals/${id}`),
    // POST /goals
    create: (data) => apiClient.post("/goals", data),
    // PATCH /goals/:id  ← backend uses PATCH not PUT
    update: (id, data) => apiClient.patch(`/goals/${id}`, data),
    // DELETE /goals/:id
    delete: (id) => apiClient.delete(`/goals/${id}`),
    // POST /goals/:id/progress
    logProgress: (goalId, data) => apiClient.post(`/goals/${goalId}/progress`, data),
};
