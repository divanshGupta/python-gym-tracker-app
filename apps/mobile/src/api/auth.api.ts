import { apiClient } from "./client";

export interface LoginPayload { username: string; password: string; }
export interface RegisterPayload { email: string; username: string; password: string; }
export interface AuthResponse { access_token: string; token_type: string; }

export const authApi = {
  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  me: () => apiClient.get("/auth/me"),
};