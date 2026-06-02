import { apiClient } from "./client";
export const workoutsApi = {
    // GET /workouts?page=1&limit=10&type=...
    getAll: (filters) => apiClient.get("/workouts", { params: filters }),
    // GET /workouts/:id
    getById: (id) => apiClient.get(`/workouts/${id}`),
    // POST /workouts
    create: (data) => apiClient.post("/workouts", data),
    // PUT /workouts/:id
    update: (id, data) => apiClient.put(`/workouts/${id}`, data),
    // DELETE /workouts/:id
    delete: (id) => apiClient.delete(`/workouts/${id}`),
};
