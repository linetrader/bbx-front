"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NIALogo from "@/assets/images/logos/NIA.png";
import api from "../../utils/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referrer, setReferrer] = useState(""); // 추천인 입력란
  const [error, setError] = useState(""); // 일반 에러 메시지
  const [emailError, setEmailError] = useState(""); // 이메일 형식 에러
  const [requiredFields, setRequiredFields] = useState<string[]>([]); // 필수 입력 에러
  const router = useRouter();

  const handleRegister = async () => {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!username) missingFields.push("username");
    if (!firstname) missingFields.push("firstname");
    if (!lastname) missingFields.push("lastname");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      setRequiredFields(missingFields);
      return;
    }
    setRequiredFields([]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");

    try {
      const { data } = await api.post("/graphql", {
        query: `
          mutation Register($email: String!, $username: String!, $firstname: String!, $lastname: String!, $password: String!, $referrer: String) {
            register(
              email: $email,
              username: $username,
              firstname: $firstname,
              lastname: $lastname,
              password: $password,
              referrer: $referrer
            )
          }
        `,
        variables: {
          email,
          username,
          firstname,
          lastname,
          password,
          referrer,
        },
      });

      if (data.errors) {
        const serverMessage = data.errors[0]?.message || "Registration failed!";
        if (serverMessage.includes("Email already exists")) {
          setError("The email address is already registered.");
        } else if (serverMessage.includes("Username already exists")) {
          setError("The username is already taken.");
        } else {
          setError(serverMessage);
        }
        return;
      }

      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
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
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Register
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            requiredFields.includes("username")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
          autoComplete="username"
        />
        {requiredFields.includes("username") && (
          <p className="text-red-500 text-sm mb-4">This field is required.</p>
        )}
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            requiredFields.includes("firstname")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
          autoComplete="given-name"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            requiredFields.includes("lastname")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
          autoComplete="family-name"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            emailError || requiredFields.includes("email")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
          autoComplete="email"
        />
        {emailError && (
          <p className="text-red-500 text-sm mb-4">{emailError}</p>
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            requiredFields.includes("password")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black focus:ring-2 focus:ring-indigo-500"
          autoComplete="new-password"
        />
        <input
          type="text"
          placeholder="Referrer (Optional)"
          value={referrer}
          onChange={(e) => setReferrer(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black focus:ring-2 focus:ring-indigo-500"
          autoComplete="off"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400"
        >
          Register
        </button>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-yellow-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
