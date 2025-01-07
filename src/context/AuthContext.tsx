// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JwtPayload, jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isTokenValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // 초기값 설정: 브라우저 환경에서만 localStorage 접근
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  const router = useRouter();

  // 클라이언트에서 토큰 로드 및 유효성 검사
  useEffect(() => {
    if (!token && typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      //console.log("AuthProvider == useEffect - storedToken", storedToken);
      if (storedToken) {
        if (isTokenExpired(storedToken)) {
          handleTokenExpiration();
        } else {
          setToken(storedToken);
        }
      }
    }
  }, []);

  // 토큰 상태가 변경되었을 때 유효성 검사
  useEffect(() => {
    //console.log("AuthProvider == useEffect - token", token);
    if (token && isTokenExpired(token)) {
      handleTokenExpiration();
    }
  }, [token]);

  // 토큰 만료 여부 확인 함수
  const isTokenExpired = (token: string) => {
    //console.log("isTokenExpired - token", token);
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return true; // 만료된 토큰
      }
      return false;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // 잘못된 토큰은 만료된 것으로 간주
    }
  };

  // 토큰 유효성 확인 함수
  const isTokenValid = () => {
    if (!token) return false;
    return !isTokenExpired(token);
  };

  // 토큰 만료 처리 함수
  const handleTokenExpiration = () => {
    logout();
    alert("Your session has expired. Please log in again.");
    router.push("/login");
  };

  // 로그인 함수
  const login = (newToken: string) => {
    localStorage.setItem("token", newToken); // localStorage에 토큰 저장
    setToken(newToken); // 상태 업데이트
    router.push("/dashboard"); // 대시보드로 이동
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("token"); // localStorage에서 토큰 삭제
    setToken(null); // 상태 초기화
    router.push("/login"); // 로그인 페이지로 이동
  };

  // 인증 여부 플래그
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
