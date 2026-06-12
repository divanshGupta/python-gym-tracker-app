// apps/mobile/src/setup.ts
import { configureApiClient } from "@gymtracker/api-client";
import { configureAuthStore } from "@gymtracker/stores";
import * as SecureStore from "expo-secure-store";

export const setupApp = () => {
  const baseURL =
    process.env.EXPO_PUBLIC_API_URL ?? "http://10.203.130.13:8000";

  console.log("=================================");
  console.log("EXPO_PUBLIC_API_URL:", process.env.EXPO_PUBLIC_API_URL);
  console.log("baseURL being set:", baseURL);
  console.log("=================================");

  configureAuthStore({
    get: () => SecureStore.getItemAsync("access_token"),
    set: (t) => SecureStore.setItemAsync("access_token", t),
    remove: () => SecureStore.deleteItemAsync("access_token"),
  });

  configureApiClient({
    baseURL,
    getToken: () => SecureStore.getItemAsync("access_token"),
    removeToken: () => SecureStore.deleteItemAsync("access_token"),
  });
};
