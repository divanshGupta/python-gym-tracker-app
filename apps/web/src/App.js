import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@gymtracker/stores";
import { AppShell } from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
// PAGES
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/WorkoutDetail";
import Exercises from "./pages/Exercises";
import CreateWorkout from "./pages/CreateWorkout";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import Goals from "./pages/Goals";
import Measurements from "./pages/Measurements";
import EditWorkout from "./pages/EditWorkout";
/**
 * Helper: wraps a page in ProtectedRoute + AppShell.
 * This replaces the old pattern of:
 *   <ProtectedRoute><Navbar /><PageComponent /></ProtectedRoute>
 */
function Protected({ children }) {
    return (_jsx(ProtectedRoute, { children: _jsx(AppShell, { children: children }) }));
}
export default function App() {
    const { restoreSession, isRestoringSession } = useAuthStore();
    useEffect(() => { restoreSession(); }, []);
    // Full-screen spinner while checking localStorage token
    if (isRestoringSession) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center bg-void", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2\n                        border-accent border-t-transparent" }) }));
    }
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/", element: _jsx(Protected, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/workouts", element: _jsx(Protected, { children: _jsx(Workouts, {}) }) }), _jsx(Route, { path: "/workouts/create", element: _jsx(Protected, { children: _jsx(CreateWorkout, {}) }) }), _jsx(Route, { path: "/workouts/:id/edit", element: _jsx(Protected, { children: _jsx(EditWorkout, {}) }) }), _jsx(Route, { path: "/workouts/:id", element: _jsx(Protected, { children: _jsx(WorkoutDetail, {}) }) }), _jsx(Route, { path: "/exercises", element: _jsx(Protected, { children: _jsx(Exercises, {}) }) }), _jsx(Route, { path: "/progress", element: _jsx(Protected, { children: _jsx(Progress, {}) }) }), _jsx(Route, { path: "/goals", element: _jsx(Protected, { children: _jsx(Goals, {}) }) }), _jsx(Route, { path: "/measurements", element: _jsx(Protected, { children: _jsx(Measurements, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(Protected, { children: _jsx(Profile, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
