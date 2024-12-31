// src/context/AuthContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isTokenValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    //console.log("useEffect - storedToken", storedToken);
    if (storedToken) {
      //console.log(storedToken);
      if (isTokenExpired(storedToken)) {
        handleTokenExpiration();
      } else {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    //console.log("useEffect - token", token);
    if (token && isTokenExpired(token)) {
      handleTokenExpiration();
    }
  }, [token]);

  const isTokenExpired = (token: string) => {
    //console.log("isTokenExpired - token", token);
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return true; // Token has expired
      }
      return false;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Treat invalid tokens as expired
    }
  };

  const isTokenValid = () => {
    if (!token) return false;
    return !isTokenExpired(token);
  };

  const handleTokenExpiration = () => {
    logout();
    alert("Your session has expired. Please log in again.");
    router.push("/login");
  };

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated, isTokenValid }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
