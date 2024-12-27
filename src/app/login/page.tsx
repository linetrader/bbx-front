// src/app/Login/page.tsx

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { graphqlRequest } from "@/utils/graphqlApi";
import LoginView from "@/components/LoginView";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, errors } = await graphqlRequest(
        `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password)
          }
        `,
        { email, password }
      );

      if (errors) {
        setError(errors[0]?.message || "Login failed");
        return;
      }

      login(data.login);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginView
      email={email}
      password={password}
      error={error}
      isLoading={isLoading}
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  );
}
