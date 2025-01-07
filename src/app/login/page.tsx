// src/app/Login/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";
import Logo from "../../assets/images/logos/logo.png";
import Bn from "@/assets/images/bnsquare.png";

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

  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    loginTitle: "로그인",
    emailPlaceholder: "이메일",
    passwordPlaceholder: "비밀번호",
    loginButton: "로그인",
    loggingIn: "로그인 중...",
    noAccount: "지금 함께하세요",
    registerHere: "회원가입하기",
    featuredBy: "파트너: ",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "loginTitle", text: "로그인" },
          { key: "emailPlaceholder", text: "이메일" },
          { key: "passwordPlaceholder", text: "비밀번호" },
          { key: "loginButton", text: "로그인" },
          { key: "loggingIn", text: "로그인 중..." },
          { key: "noAccount", text: "지금 함께하세요" },
          { key: "registerHere", text: "회원가입하기" },
          { key: "featuredBy", text: "파트너: " },
        ];

        const translations = await Promise.all(
          keys.map((item) => fetchTranslation(item.text, language))
        );

        const updatedTranslations = keys.reduce(
          (acc, item, index) => {
            acc[item.key as keyof typeof translatedTexts] = translations[index];
            return acc;
          },
          { ...translatedTexts }
        );

        setTranslatedTexts(updatedTranslations);
      } catch (error) {
        console.error("[ERROR] Failed to fetch translations:", error);
      }
    };

    fetchTranslations();
  }, [language]);

  const inputStyles =
    "w-full px-4 py-3 mb-4 border border-cyan-500 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
      {/* Main Content */}
      <main className="flex flex-col items-center mt-5">
        {/* Logo Section */}
        <div style={{ width: "240px", position: "relative" }}>
          <Image src={Logo} alt="BitBoostX Logo" />
        </div>

        {/* Login Form */}
        <div className="w-[80%] bg-gray-900/80 p-8 rounded-lg shadow-2xl max-w-md border border-cyan-500 mt-5">
          <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6">
            {translatedTexts.loginTitle}
          </h1>
          {error && (
            <div className="bg-red-600/70 px-4 py-3 rounded text-center">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder={translatedTexts.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyles}
          />
          <input
            type="password"
            placeholder={translatedTexts.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputStyles}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-400"
            }`}
          >
            {loading ? translatedTexts.loggingIn : translatedTexts.loginButton}
          </button>
          <p className="text-center mt-4">
            {translatedTexts.noAccount}{" "}
            <Link href="/register" className="text-cyan-500">
              {translatedTexts.registerHere}
            </Link>
          </p>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="flex flex-col items-center justify-center mt-10">
        <div className="relative w-64 h-64 mb-4">
          <h1 className="text-3xl font-bold text-center text-cyan-500 mb-4">
            {translatedTexts.featuredBy}
          </h1>
          <div>
            <Image src={Bn} alt="binance" />
          </div>
        </div>
      </footer>
    </div>
  );
}
