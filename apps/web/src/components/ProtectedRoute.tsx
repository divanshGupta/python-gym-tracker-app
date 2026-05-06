import { Navigate } from "react-router-dom"
import authStore from "../store/authStore"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!authStore.isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}