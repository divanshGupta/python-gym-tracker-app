export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface AuthTokensResponse {
  access_token: string;
  token_type: "bearer";
}

export interface UserResponse {
  id:         string;
  email:      string;
  username:   string;
  created_at: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}