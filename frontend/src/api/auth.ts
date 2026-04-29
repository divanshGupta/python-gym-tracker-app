import api from "./axios"

export const registerUser = (data: any) => api.post("/auth/register", data)
export const loginUser = (data: any) => api.post("/auth/login", data)
export const getProfile = () => api.get("/user/profile")