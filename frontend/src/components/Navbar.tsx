import { Link, useNavigate } from "react-router-dom"
import authStore from "../store/authStore"

export default function Navbar() {
  const navigate = useNavigate()

  const logout = () => {
    authStore.removeToken()
    navigate("/login")
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-green-400">GymTracker</Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-green-400">Dashboard</Link>
        <Link to="/workouts" className="hover:text-green-400">Workouts</Link>
        <Link to="/exercises" className="hover:text-green-400">Exercises</Link>
        <Link to="/profile" className="hover:text-green-400 text-sm">Profile</Link>
        <button
          onClick={logout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}