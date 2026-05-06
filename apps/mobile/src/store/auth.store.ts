import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { authApi, LoginPayload, RegisterPayload } from "../api/auth.api";

interface User { id: string; email: string; username: string; }

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  restoreSession: async () => {
    const token = await SecureStore.getItemAsync("access_token");
    if (!token) return;
    try {
      const { data } = await authApi.me();
      set({ user: data, isAuthenticated: true });
    } catch {
      await SecureStore.deleteItemAsync("access_token");
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.login(payload);
      await SecureStore.setItemAsync("access_token", data.access_token);
      const me = await authApi.me();
      set({ user: me.data, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.detail ?? "Login failed", isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.register(payload);
      await SecureStore.setItemAsync("access_token", data.access_token);
      const me = await authApi.me();
      set({ user: me.data, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.detail ?? "Registration failed", isLoading: false });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("access_token");
    set({ user: null, isAuthenticated: false });
  },
}));