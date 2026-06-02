import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@gymtracker/stores"
import { AppShell } from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute"
// PAGES
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Workouts from "./pages/Workouts"
import WorkoutDetail from "./pages/WorkoutDetail"
import Exercises from "./pages/Exercises"
import CreateWorkout from "./pages/CreateWorkout"
import Profile from "./pages/Profile"
import Progress from "./pages/Progress"
import Goals from "./pages/Goals"
import Measurements from "./pages/Measurements"
import EditWorkout from "./pages/EditWorkout"

/**
 * Helper: wraps a page in ProtectedRoute + AppShell.
 * This replaces the old pattern of:
 *   <ProtectedRoute><Navbar /><PageComponent /></ProtectedRoute>
 */
function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {

  const { restoreSession, isRestoringSession } = useAuthStore();

  useEffect(() => { restoreSession(); }, []);

  // Full-screen spinner while checking localStorage token
  if (isRestoringSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-void">
        <div className="h-8 w-8 animate-spin rounded-full border-2
                        border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        {/* ── Auth (no shell) ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected routes (with sidebar shell) ── */}
        <Route path="/"               element={<Protected><Dashboard /></Protected>} />
        <Route path="/workouts"       element={<Protected><Workouts /></Protected>} />
        <Route path="/workouts/create" element={<Protected><CreateWorkout /></Protected>} />
        <Route path="/workouts/:id/edit" element={<Protected><EditWorkout /></Protected>} />
        <Route path="/workouts/:id"   element={<Protected><WorkoutDetail /></Protected>} />
        <Route path="/exercises"      element={<Protected><Exercises /></Protected>} />
        <Route path="/progress"       element={<Protected><Progress /></Protected>} />
        <Route path="/goals"          element={<Protected><Goals /></Protected>} />
        <Route path="/measurements"   element={<Protected><Measurements /></Protected>} />
        <Route path="/profile"        element={<Protected><Profile /></Protected>} /> 

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}