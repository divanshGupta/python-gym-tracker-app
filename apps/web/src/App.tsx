import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@gymtracker/stores"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Workouts from "./pages/Workouts"
import WorkoutDetail from "./pages/WorkoutDetail"
import Exercises from "./pages/Exercises"
import Navbar from "./components/Navbar"
import CreateWorkout from "./pages/CreateWorkout"
import Profile from "./pages/Profile"
import Progress from "./pages/Progress"
import Goals from "./pages/Goals"
import Measurements from "./pages/Measurements"

export default function App() {

  const { restoreSession, isRestoringSession } = useAuthStore();

  useEffect(() => { restoreSession(); }, []);

  // Full-screen spinner while checking localStorage token
  if (isRestoringSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2
                        border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/" element={
          <ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>
        }/>
        <Route path="/workouts" element={
          <ProtectedRoute><Navbar /><Workouts /></ProtectedRoute>
        }/>
        <Route path="/workouts/create" element={
          <ProtectedRoute><Navbar /><CreateWorkout /></ProtectedRoute>
        }/>
        <Route path="/workouts/:id" element={
          <ProtectedRoute><Navbar /><WorkoutDetail /></ProtectedRoute>
        }/>
        <Route path="/exercises" element={
          <ProtectedRoute><Navbar /><Exercises /></ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute><Navbar /><Profile /></ProtectedRoute>
        }/>
        <Route path="/progress" element={
          <ProtectedRoute><Navbar /><Progress /></ProtectedRoute>
        }/>
        <Route path="/goals" element={
          <ProtectedRoute><Navbar /><Goals /></ProtectedRoute>
        }/>
        <Route path="/measurements" element={
          <ProtectedRoute><Navbar /><Measurements /></ProtectedRoute>
        }/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}