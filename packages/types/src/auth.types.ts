export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface AuthTokensResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

// Alias for api-client
export type UserResponse = User;