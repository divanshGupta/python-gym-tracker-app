import axios, { type AxiosInstance } from "axios";
import { API_EVENTS, apiEvents } from "./events";

// ─── Token storage interface ───────────────────────────────────────────────
// Injected per-platform so this package stays platform-agnostic.
// Web:    localStorage
// Native: expo-secure-store

let getToken: () => Promise<string | null> = async () => null;
let removeToken: () => Promise<void> = async () => {};

export const configureApiClient = (config: {
  baseURL: string;
  getToken: () => Promise<string | null>;
  removeToken: () => Promise<void>;
}) => {
  apiClient.defaults.baseURL = config.baseURL;
  getToken = config.getToken;
  removeToken = config.removeToken;
};

export const apiClient: AxiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      // Fire event — auth store and UI can listen for this
      apiEvents.emit(API_EVENTS.UNAUTHORIZED);
    }
    return Promise.reject(error);
  },
);
