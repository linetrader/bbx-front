"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGraphQL } from "@/utils/graphqlApi";

export function useLogin() {
  const { login } = useAuth();
  const { graphqlRequest, loading, error, setError, resetError } = useGraphQL();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("handleLogin");
    if (!email || !password) {
      resetError();
      setError("Email and password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      resetError();
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const { data } = await graphqlRequest(
        `
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password)
          }
        `,
        { email, password },
        true // skipAuthCheck 설정
      );

      if (data) {
        console.log(data);
      }

      login(data.login);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleLogin,
    loading,
    error,
  };
}
