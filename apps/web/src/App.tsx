import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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

        <Route path="/workouts/create" element={
          <ProtectedRoute>
            <Navbar />
            <CreateWorkout />
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

        <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar />
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/progress" element={
          <ProtectedRoute>
            <Navbar />
            <Progress />
          </ProtectedRoute>
        }/>

        <Route path="/goals" element={
          <ProtectedRoute>
            <Navbar />
            <Goals />
          </ProtectedRoute>
        }/>

        <Route path="/measurements" element={
          <ProtectedRoute>
            <Navbar />
            <Measurements />
          </ProtectedRoute>
        }/>

      </Routes>
    </BrowserRouter>
  )
}