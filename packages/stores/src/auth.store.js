import { create } from "zustand";
import { authApi } from "@gymtracker/api-client";
import { apiEvents, API_EVENTS } from "@gymtracker/api-client";
;
let _storage = {
    get: async () => null,
    set: async () => { },
    remove: async () => { },
};
// call once in apps/web/src/main.tsx and apps/mobile/App.tsx
export const configureAuthStore = (storage) => {
    _storage = storage;
};
// Subscribe ONCE when the module loads — not inside restoreSession
apiEvents.on(API_EVENTS.UNAUTHORIZED, () => {
    useAuthStore.setState({ user: null, isAuthenticated: false, error: null });
});
// Store-------------------------------------
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isRestoringSession: true, // assume session until proven otherwise
    isLoading: false,
    error: null,
    // ---- called once on app mount --------
    restoreSession: async () => {
        try {
            const token = await _storage.get();
            if (!token) {
                set({ isRestoringSession: false });
                return;
            }
            const { data: user } = await authApi.me();
            set({ user, isAuthenticated: true, isRestoringSession: false });
        }
        catch {
            // Token expired or invalid — wipe it and go to login
            await _storage.remove();
            set({ isRestoringSession: false });
        }
    },
    // ------------- Login ------------------
    login: async (payload) => {
        console.log("→ STORE LOGIN called with:", JSON.stringify(payload));
        set({ isLoading: true, error: null });
        try {
            const { data: tokens } = await authApi.login(payload);
            await _storage.set(tokens.access_token);
            const { data: user } = await authApi.me();
            set({ user, isAuthenticated: true, isLoading: false });
        }
        catch (e) {
            set({
                error: e.response?.data?.detail ?? "Login failed",
                isLoading: false,
            });
        }
    },
    // ---------- register --------------
    register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            // step 1 - create the account
            await authApi.register(payload);
            // step 2 - log in immediately to get token
            const { data: tokens } = await authApi.login({
                email: payload.email,
                password: payload.password,
            });
            await _storage.set(tokens.access_token);
            // step 3 - fetch user object
            const { data: user } = await authApi.me();
            set({ user, isAuthenticated: true, isLoading: false });
        }
        catch (e) {
            set({
                error: e.response?.data?.detail ?? "Registration failed",
                isLoading: false,
            });
        }
    },
    // ----------- Logout -----------------
    logout: async () => {
        await _storage.remove();
        set({ user: null, isAuthenticated: false, error: null });
    },
    clearError: () => set({ error: null }),
}));
