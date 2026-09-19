/* eslint-disable no-unused-vars */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleRegister({
      username,
      email,
      password,
      confirmPassword,
    });

    navigate("/");
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

        <div className="absolute w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-ping" />

        {/* Loader */}
        <div className="relative flex flex-col items-center">
          {/* Outer Ring */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border border-blue-500/20" />

            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />

            <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin [animation-duration:1.5s]" />

            {/* Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse">
                AI
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="mt-8 text-center">
            <h2 className="text-white text-lg font-semibold tracking-wide">
              Interview AI
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Preparing your experience
              <span className="inline-flex ml-1">
                <span className="animate-bounce [animation-delay:0ms]">.</span>

                <span className="animate-bounce [animation-delay:150ms]">
                  .
                </span>

                <span className="animate-bounce [animation-delay:300ms]">
                  .
                </span>
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== REGISTER PAGE ====================

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black font-bold text-xl mb-4">
            AI
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Start preparing smarter with Interview AI
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* ==================== REGISTER FORM ==================== */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-200"
              >
                Username
              </label>

              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                required
                className="w-full h-12 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-200"
              >
                Email
              </label>

              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full h-12 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-200"
              >
                Password
              </label>

              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                required
                className="w-full h-12 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-200"
              >
                Confirm Password
              </label>

              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                className="w-full h-12 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 outline-none transition focus:border-white focus:ring-1 focus:ring-white"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer h-12 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-zinc-800 flex-1" />

            <span className="text-xs text-gray-500">OR</span>

            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          {/* ==================== GOOGLE REGISTER ==================== */}

          <button
            type="button"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
            }}
            className="w-full cursor-pointer h-12 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-all duration-200 flex items-center justify-center gap-3 font-medium active:scale-[0.98]"
          >
            {/* Google Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.805 12.23c0-.79-.065-1.55-.21-2.28H12v4.32h5.49a4.69 4.69 0 01-2.04 3.08v2.56h3.3c1.93-1.78 3.055-4.4 3.055-7.68z"
                fill="#4285F4"
              />

              <path
                d="M12 22c2.76 0 5.075-.91 6.76-2.47l-3.3-2.56c-.91.61-2.07.98-3.46.98-2.66 0-4.91-1.8-5.72-4.22H2.87v2.64A10.2 10.2 0 0012 22z"
                fill="#34A853"
              />

              <path
                d="M6.28 13.73A6.13 6.13 0 015.96 12c0-.6.11-1.18.32-1.73V7.63H2.87A10.01 10.01 0 002 12c0 1.61.39 3.13 1.07 4.37l3.21-2.64z"
                fill="#FBBC05"
              />

              <path
                d="M12 6.05c1.5 0 2.84.52 3.9 1.54l2.92-2.92C17.07 3.05 14.76 2 12 2a10.2 10.2 0 00-9.13 5.63l3.41 2.64C7.09 7.85 9.34 6.05 12 6.05z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-white font-medium hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
};

export default Register;
