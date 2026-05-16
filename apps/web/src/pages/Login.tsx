// apps/web/src/pages/Login.tsx
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
    <div className="min-h-screen bg-void flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border-default bg-surface p-6 sm:p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-accent">GymTracker</h1>
        <h2 className="text-xl font-semibold text-text-primary">Login</h2>
        <p className="mt-1 mb-6 text-sm text-text-secondary">
          Welcome back. Continue your fitness journey.
        </p>

        {error && (
          <p className="mb-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="
              w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-danger">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="
           rounded-lg bg-accent py-2.5 font-semibold text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          No account?{" "}
          <Link to="/register" className="font-medium text-accent transition-colors hover:opacity-80">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}