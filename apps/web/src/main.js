import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { configureApiClient } from "@gymtracker/api-client";
import { configureAuthStore, useAuthStore, useWorkoutSessionStore } from "@gymtracker/stores";
import { STALE_TIMES } from "@gymtracker/constants";
import App from "./App";
import "./index.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
// ── Inject web token storage ───────────────────────────────────────────────
// localStorage is web-only — never imported in shared packages
configureAuthStore({
    get: async () => localStorage.getItem("access_token"),
    set: async (t) => localStorage.setItem("access_token", t),
    remove: async () => localStorage.removeItem("access_token"),
});
configureApiClient({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
    getToken: async () => localStorage.getItem("access_token"),
    removeToken: async () => localStorage.removeItem("access_token"),
});
// ── QueryClient ────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: STALE_TIMES.workouts,
        },
    },
});
// Clear react-query cache and reset workout session on logout/unauthorization to prevent state leak
let wasAuthenticated = useAuthStore.getState().isAuthenticated;
useAuthStore.subscribe((state) => {
    const isAuth = state.isAuthenticated;
    if (wasAuthenticated && !isAuth) {
        queryClient.clear();
        useWorkoutSessionStore.getState().cancelSession();
    }
    wasAuthenticated = isAuth;
});
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsxs(QueryClientProvider, { client: queryClient, children: [_jsx(App, {}), _jsx(ReactQueryDevtools, { initialIsOpen: false })] }) }));
