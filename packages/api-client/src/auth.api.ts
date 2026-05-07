import { apiClient } from "./client";
import type { LoginPayload, RegisterPayload, AuthTokensResponse, UserResponse } from "@gymtracker/types";

// auth API
export const authApi = {
    // POST /auth/login -> return JWT
    login: (data: LoginPayload) => 
        apiClient.post<AuthTokensResponse>("/auth/login", data),

    // POST /auth/register -> returns JWT
    register: (data: RegisterPayload) => 
        apiClient.post<AuthTokensResponse>("/auth/register", data),

    // GET /auth/me -> returns current user
    me: () => 
        apiClient.get<UserResponse>("/auth/me")
}
