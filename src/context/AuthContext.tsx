"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// AuthContext 타입 정의
interface AuthContextType {
  token: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// AuthContext 생성
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // userId 상태 추가
  const router = useRouter();

  // 초기화 시 localStorage에서 토큰과 userId 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // 로그인 함수
  const login = (newToken: string, newUserId: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId); // userId 저장
    setToken(newToken);
    setUserId(newUserId); // userId 상태 업데이트
    router.push("/dashboard");
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // userId 제거
    setToken(null);
    setUserId(null); // userId 상태 초기화
    router.push("/login");
  };

  // 인증 여부 확인
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, userId, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// AuthContext를 쉽게 사용하기 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
