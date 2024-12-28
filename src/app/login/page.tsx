// src/app/Login/page.tsx

"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import Logo from "../../assets/images/logos/LOGO.png";

export default function Login() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    loading,
    error,
  } = useLogin();

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col items-center pt-12">
      {/* 로고 섹션 */}
      <div className="relative w-64 h-64 mb-0">
        <Image
          src={Logo}
          alt="BitBoostX Logo"
          width={240} // 명시적 너비
          height={240} // 명시적 높이
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-contain"
        />
      </div>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-4">
          Login
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <input
          ref={emailInputRef}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          ref={passwordInputRef}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-5 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white placeholder-gray-400"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 rounded mb-4 font-semibold shadow-lg ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-400 text-black"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-gray-300">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
