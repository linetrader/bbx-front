// src/app/Login/page.tsx

"use client";

import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import api from "../../utils/api";
import Image from "next/image";
import NIALogo from "@/assets/images/logos/NIA.png";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      emailInputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post("/graphql", {
        query: `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              token
              userId
            }
          }
        `,
        variables: { email, password },
      });

      if (data.errors) {
        const serverMessage = data.errors[0]?.message || "An error occurred.";
        if (serverMessage.includes("Email not found")) {
          setError("The email address you entered is incorrect.");
          emailInputRef.current?.focus();
        } else if (serverMessage.includes("Incorrect password")) {
          setError("The password you entered is incorrect.");
          passwordInputRef.current?.focus();
        } else {
          setError(serverMessage);
        }
        return;
      }

      if (data.data && data.data.login) {
        const { token, userId } = data.data.login;
        login(token, userId);
        setError("");
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    } catch (error: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <Image
              src={NIALogo}
              alt="NIA Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">
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
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          ref={passwordInputRef}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-800 text-white placeholder-gray-400"
        />
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full py-2 rounded mb-4 font-semibold ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-400 text-black"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-gray-300">
          Don't have an account?{" "}
          <Link href="/register" className="text-yellow-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
