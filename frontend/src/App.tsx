import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Workouts from "./pages/Workouts"
import WorkoutDetail from "./pages/WorkoutDetail"
import Exercises from "./pages/Exercises"
import Navbar from "./components/Navbar"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="/workouts" element={
          <ProtectedRoute>
            <Navbar />
            <Workouts />
          </ProtectedRoute>
        }/>
        <Route path="/workouts/:id" element={
          <ProtectedRoute>
            <Navbar />
            <WorkoutDetail />
          </ProtectedRoute>
        }/>
        <Route path="/exercises" element={
          <ProtectedRoute>
            <Navbar />
            <Exercises />
          </ProtectedRoute>
        }/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}