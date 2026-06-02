import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// apps/web/src/pages/Regsiter.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@gymtracker/stores";
// 🔹 Schema
const schema = z.object({
    username: z.string().min(3, "Min 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export default function Register() {
    const navigate = useNavigate();
    const { register: registerUser, isLoading, error, isAuthenticated, clearError } = useAuthStore();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
    });
    // Redirect once authenticated = replaces the onSuccess navigate() call
    useEffect(() => {
        if (isAuthenticated)
            navigate("/", { replace: true });
    }, [isAuthenticated]);
    // clear store error when component unmounts (navigating away)
    useEffect(() => { return () => clearError(); }, []);
    const onSubmit = (data) => {
        registerUser({
            username: data.username,
            email: data.email,
            password: data.password,
        });
    };
    return (_jsx("div", { className: "min-h-screen bg-void flex items-center justify-center px-6 py-10", children: _jsxs("div", { className: "w-full max-w-md rounded-2xl border border-border-default bg-surface p-8 shadow-sm", children: [_jsx("h1", { className: "mb-2 text-2xl font-semibold tracking-tight text-accent", children: "GymTracker" }), _jsx("h2", { className: "text-xl font-semibold text-text-primary", children: "Create Account" }), _jsx("p", { className: "mt-1 mb-6 text-sm text-text-secondary", children: "Start tracking your workouts and progress." }), error && (_jsx("p", { className: "mb-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger", children: error })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-5", children: [_jsxs("div", { children: [_jsx("input", { ...register("username"), placeholder: "Username", className: "w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" }), errors.username && (_jsx("p", { className: "mt-1 text-xs text-danger", children: errors.username.message }))] }), _jsxs("div", { children: [_jsx("input", { ...register("email"), type: "email", placeholder: "Email", className: "w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" }), errors.email && (_jsx("p", { className: "mt-1 text-xs text-danger", children: errors.email.message }))] }), _jsxs("div", { children: [_jsx("input", { ...register("password"), type: "password", placeholder: "Password", className: "w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" }), errors.password && (_jsx("p", { className: "mt-1 text-xs text-danger", children: errors.password.message }))] }), _jsxs("div", { children: [_jsx("input", { ...register("confirmPassword"), type: "password", placeholder: "Confirm Password", className: "w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20" }), errors.confirmPassword && (_jsx("p", { className: "text-red-400 text-xs mt-1", children: errors.confirmPassword.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "rounded-lg bg-accent py-2.5 font-semibold text-text-primary transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-50", children: isLoading ? "Creating account..." : "Register" })] }), _jsxs("p", { className: "mt-6 text-center text-sm text-text-secondary", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "font-medium text-accent transition-colors hover:opacity-80", children: "Login" })] })] }) }));
}
