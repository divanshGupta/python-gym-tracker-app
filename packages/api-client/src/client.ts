import axios, { type AxiosInstance } from "axios";

// ─── Token storage interface ───────────────────────────────────────────────
// Injected per-platform so this package stays platform-agnostic.
// Web:    localStorage
// Native: expo-secure-store

let getToken: () => Promise<string | null> = async () => null;
let removeToken: () => Promise<void> = async () => {};

// Call this once at app startup before any API calls
export const configureApiClient = (config: {
  getToken: () => Promise<string | null>;
  removeToken: () => Promise<void>;
  baseURL: string;
}) => {
  getToken = config.getToken;
  removeToken = config.removeToken;
  apiClient.defaults.baseURL = config.baseURL;
};

// Axios instance
export const apiClient: AxiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// attach jwt on every request
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// on 401 - wipe token; the auth store listener redirects to login
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) await removeToken();
    return Promise.reject(error);
  }
);

// The configureApiClient pattern is the key insight — the API client itself is shared, but token storage is injected per-platform. Web injects localStorage, Native injects SecureStore. Same business logic, different storage driver.