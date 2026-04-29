import api from "./axios"

export const getExercises = () => api.get("/exercises")
export const createExercise = (data: any) => api.post("/exercises", data)