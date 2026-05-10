export interface User {
  id:         number;    // int on backend, not string
  email:      string;
  username:   string;
  created_at: string;
}

export interface AuthTokensResponse {
  access_token:  string;
  refresh_token: string;
  token_type:    string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface RegisterPayload {
  email:    string;
  username: string;
  password: string;
}

export type UserResponse = User;