import api from "./axios"

export const getWorkouts = (params: any) => api.get("/workouts", { params })
export const getWorkout = (id: any) => api.get(`/workouts/${id}`)
export const createWorkout = (data: any) => api.post("/workouts", data)
export const updateWorkout = (id: any, data: any) => api.put(`/workouts/${id}`, data)
export const deleteWorkout = (id: any) => api.delete(`/workouts/${id}`)
export const getStats = () => api.get("/stats/summary")
export const getPersonalBests = () => api.get("/stats/personal_bests")