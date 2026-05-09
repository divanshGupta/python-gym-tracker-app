import axios, { type AxiosInstance } from "axios";

// ─── Token storage interface ───────────────────────────────────────────────
// Injected per-platform so this package stays platform-agnostic.
// Web:    localStorage
// Native: expo-secure-store

let getToken: () => Promise<string | null> = async () => null;
let removeToken: () => Promise<void> = async () => {};

// Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL:  "http://localhost:8000", // fallback, overwritten by configureApiClient
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Call this once at app startup before any API calls
export const configureApiClient = (config: {
  baseURL: string;
  getToken: () => Promise<string | null>;
  removeToken: () => Promise<void>;
}) => {
  apiClient.defaults.baseURL = config.baseURL;
  getToken = config.getToken;
  removeToken = config.removeToken;

  // Debug — remove after confirming it works
  console.log("→ apiClient baseURL set to:", config.baseURL);
};

// attach jwt on every request
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Full URL being called
  const fullURL = `${config.baseURL}${config.url}`;
  console.log("→ AXIOS REQUEST:", config.method?.toUpperCase(), fullURL);
  console.log("→ AXIOS BODY:", JSON.stringify(config.data));
  console.log("→ AXIOS HEADERS:", JSON.stringify(config.headers));
  return config;
});

// on 401 - wipe token; the auth store listener redirects to login
apiClient.interceptors.response.use(
  (res) => {
    console.log("→ AXIOS RESPONSE:", res.status, res.config.url);
    return res;
  },
  async (error) => {
    if (error.response) {
      console.log("→ AXIOS ERROR STATUS:", error.response.status);
      console.log("→ AXIOS ERROR DATA:", JSON.stringify(error.response.data));
    } else if (error.request) {
      // Request was made but no response received — network issue
      console.log("→ AXIOS NO RESPONSE (network error):", error.message);
      console.log("→ AXIOS ERROR CODE:", error.code);
    } else {
      console.log("→ AXIOS SETUP ERROR:", error.message);
    }
    if (error.response?.status === 401) await removeToken();
    return Promise.reject(error);
  }
);

// The configureApiClient pattern is the key insight — the API client itself is shared, but token storage is injected per-platform. Web injects localStorage, Native injects SecureStore. Same business logic, different storage driver.