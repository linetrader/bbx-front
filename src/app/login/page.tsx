// src/app/Login/page.tsx

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGraphQL } from "@/utils/graphqlApi";
import LoginView from "@/components/LoginView";

export default function Login() {
  const { login } = useAuth();
  const { graphqlRequest, loading, error, setError, resetError } = useGraphQL();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return resetError(), setError("Email and password are required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resetError(), setError("Please enter a valid email address.");
    }

    try {
      const { data } = await graphqlRequest(
        `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password)
            }
          `,
        { email, password },
        true
      );

      login(data.login);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <LoginView
      email={email}
      password={password}
      error={error}
      loading={loading}
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  );
}
