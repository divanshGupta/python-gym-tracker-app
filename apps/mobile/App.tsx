// mobile/App.tsx
import React, { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useAuthStore, useWorkoutSessionStore } from "@gymtracker/stores"
import { STALE_TIMES } from "@gymtracker/constants"
import { RootNavigator } from "./src/navigation/RootNavigator"
import { tokens } from "./src/theme/tokens"
import { setupApp } from "./src/setup"

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