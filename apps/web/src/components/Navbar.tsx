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
    <nav className="bg-surface text-text-primary px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-semibold text-accent">GymTracker</Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-accent-light">Dashboard</Link>
        <Link to="/workouts" className="hover:text-accent-light">Workouts</Link>
        <Link to="/exercises" className="hover:text-accent-light">Exercises</Link>
        <Link to="/progress" className="hover:text-accent-light">Progress</Link>
        <Link to="/goals" className="hover:text-accent-light">Goals</Link>
        <Link to="/measurements" className="hover:text-accent-light">Measurements</Link>
        {/* <button
          onClick={logout}
          className="bg-danger px-3 py-1 rounded-xl hover:scale-105"
        >
          Logout
        </button> */}
      </div>
    </nav>
  )
}