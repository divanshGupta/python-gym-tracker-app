import { apiClient } from "./client";
// auth API
export const authApi = {
    // POST /auth/login -> return JWT
    // FastAPI OAuth2PasswordRequestForm expects form data, not JSON
    login: (data) => apiClient.post("/auth/login", data),
    // POST /auth/register -> returns JWT
    register: (data) => apiClient.post("/auth/register", data),
    // GET /auth/me -> returns current user
    me: () => apiClient.get("/auth/me")
};
