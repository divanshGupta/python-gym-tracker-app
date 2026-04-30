import api from "./axios"
import type { User, Token } from "../types"

export const registerUser = (data: { username: string; email: string; password: string }) => 
    api.post("/auth/register", data)

export const loginUser = (data: { email: string; password: string }) => 
    api.post("/auth/login", data)

export const getProfile = () => 
    api.get("/user/profile")