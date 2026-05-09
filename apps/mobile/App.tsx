import React, { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
// import * as SecureStore from "expo-secure-store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { configureApiClient } from "@gymtracker/api-client"
import { useAuthStore } from "@gymtracker/stores"
import { STALE_TIMES } from "@gymtracker/constants"
import { RootNavigator } from "./src/navigation/RootNavigator"
import { tokens } from "./src/theme/tokens"
import { setupApp } from "./src/setup"

// ----------- Inject platform-specific token storage once ---------------------

// configureAuthStore({
//   get: () => SecureStore.getItemAsync("access_token"),
//   set: (t) => SecureStore.setItemAsync("access_token", t),
//   remove: () => SecureStore.deleteItemAsync("access_token"),
// })

// configureApiClient({
//   baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000",
//   getToken: () => SecureStore.getItemAsync("access_token"),
//   removeToken: () => SecureStore.deleteItemAsync("access_token"),
// })

setupApp();

// ------- QueryClient - each app creates its own instance ------------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: STALE_TIMES.workouts,
    }
  }
})

// -------- Session gate - shows spinner until stored token is resolved ---------

function SessionGate({ children }: { children: React.ReactNode }) {
  const { isRestoringSession, restoreSession } = useAuthStore();

  useEffect(()=> { restoreSession() }, [])

  if (isRestoringSession) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center",
                     backgroundColor: tokens.colors.void }}>
        <ActivityIndicator color={tokens.colors.accent} size="large" />
      </View>
    )
  }

  return <>{children}</>
}

// ----------- Root ---------------

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionGate>
        <RootNavigator />
      </SessionGate>
    </QueryClientProvider>
  )
}