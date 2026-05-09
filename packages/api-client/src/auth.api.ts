import { apiClient } from "./client";
import type { LoginPayload, RegisterPayload, AuthTokensResponse, User } from "@gymtracker/types";

// auth API
export const authApi = {
    // POST /auth/login -> return JWT
    // FastAPI OAuth2PasswordRequestForm expects form data, not JSON
    login: (data: LoginPayload) =>
    apiClient.post<AuthTokensResponse>("/auth/login", data),

    // POST /auth/register -> returns JWT
    register: (data: RegisterPayload) => 
        apiClient.post<User>("/auth/register", data),

    // GET /auth/me -> returns current user
    me: () => 
        apiClient.get<User>("/auth/me")
}
