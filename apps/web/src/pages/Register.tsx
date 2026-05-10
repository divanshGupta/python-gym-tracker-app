import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "@gymtracker/stores"

// 🔹 Schema
const schema = z.object({
  username: z.string().min(3, "Min 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegisterFormInputs = z.infer<typeof schema>

export default function Register() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(schema),
  })

  // Redirect once authenticated = replaces the onSuccess navigate() call
  useEffect(()=> {
    if (isAuthenticated) navigate("/", { replace: true })
  }, [isAuthenticated]);

  // clear store error when component unmounts (navigating away)
  useEffect(()=> { return () => clearError(); }, [])

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
      registerUser({
        username: data.username,
        email:    data.email,
        password: data.password,
      })
   }
   
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-400 mb-6">GymTracker</h1>
        <h2 className="text-white text-xl mb-4">Create Account</h2>

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              {...register("username")}
              placeholder="Username"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

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

          <div>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}