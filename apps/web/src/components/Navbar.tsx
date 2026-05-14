import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@gymtracker/stores"
import { useEffect } from "react";

export default function Navbar() {
  const { logout, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate()

  useEffect(()=> {
    if (isAuthenticated) navigate("/", { replace: true })
      else navigate("/login", { replace: false })
  }, [isAuthenticated]);

  // clear store error when component unmounts (navigating away)
  useEffect(()=> { return () => clearError(); }, [])

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-accent">GymTracker</Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-green-400">Dashboard</Link>
        <Link to="/workouts" className="hover:text-green-400">Workouts</Link>
        <Link to="/exercises" className="hover:text-green-400">Exercises</Link>
        <Link to="/progress" className="hover:text-green-400">Progress</Link>
        <Link to="/profile" className="hover:text-green-400">Profile</Link>
        <Link to="/goals" className="hover:text-green-400">Goals</Link>
        <Link to="/measurements" className="hover:text-green-400">Measurements</Link>
        <button
          onClick={logout}
          className="bg-danger px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}