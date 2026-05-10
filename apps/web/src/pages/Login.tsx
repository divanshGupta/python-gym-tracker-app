import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "@gymtracker/stores"
import { useEffect } from "react"

// 🔹 Zod Schema
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
})

type LoginFormInputs = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema),
  })

  // Redirect once authenticated = replaces the onSuccess navigate() call
  useEffect(()=> {
    if (isAuthenticated) navigate("/", { replace: true })
  }, [isAuthenticated]);

  // clear store error when component unmounts (navigating away)
  useEffect(()=> { return () => clearError(); }, [])

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    login(data)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-400 mb-6">GymTracker</h1>
        <h2 className="text-white text-xl mb-4">Login</h2>

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4">
          No account?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}