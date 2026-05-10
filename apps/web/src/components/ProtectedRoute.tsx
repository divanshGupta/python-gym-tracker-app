import { Navigate } from "react-router-dom"
import { useAuthStore } from "@gymtracker/stores"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}