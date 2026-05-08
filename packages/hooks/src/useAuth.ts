import { useQuery }     from "@tanstack/react-query";
import { authApi }      from "@gymtracker/api-client";
import { queryKeys, STALE_TIMES } from "@gymtracker/constants";

// Fetch current user — used to verify session is still valid
// Note: auth state itself lives in useAuthStore (Zustand)
// This hook is for components that need to re-verify or refresh user data
export const useCurrentUser = () =>
  useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn:  () => authApi.me().then((r) => r.data),
    staleTime: STALE_TIMES.auth,
    retry:     false,   // don't retry on 401 — let interceptor handle it
  });