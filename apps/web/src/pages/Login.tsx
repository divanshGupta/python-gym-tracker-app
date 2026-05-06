import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../api/auth"
import authStore from "../store/authStore"
import axios, { AxiosError } from "axios"

// 🔹 Zod Schema
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
})

// 🔹 Infer Type from Schema
type LoginFormInputs = z.infer<typeof schema>

// 🔹 API Response Type
type LoginResponse = {
  access_token: string
}

// 🔹 Error Response Type
type ErrorResponse = {
  detail?: string
}

export default function Login() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema),
  })

  const { mutate, isPending, error } = useMutation<
    { data: LoginResponse }, // success response
    AxiosError<ErrorResponse>, // error type
    LoginFormInputs // variables (form data)
  >({
    mutationFn: loginUser,
    onSuccess: (res) => {
      authStore.setToken(res.data.access_token)
      navigate("/")
    },
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-400 mb-6">GymTracker</h1>
        <h2 className="text-white text-xl mb-4">Login</h2>

        {error && (
          <p className="text-red-400 text-sm mb-4">
            {error.response?.data?.detail || "Login failed"}
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
            disabled={isPending}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold disabled:opacity-50"
          >
            {isPending ? "Logging in..." : "Login"}
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