// src/app/Login/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";
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
    loginTitle: "Login",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    loginButton: "Login",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    registerHere: "Register here",
    featuredBy: "FEATURED BY",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      //console.log("Login 현재 언어 : ", language);
      const translations = await Promise.all([
        translateText("Login", language),
        translateText("Email", language),
        translateText("Password", language),
        translateText("Login", language),
        translateText("Logging in...", language),
        translateText("Don't have an account?", language),
        translateText("Register here", language),
        translateText("FEATURED BY", "en"),
      ]);

      setTranslatedTexts({
        loginTitle: translations[0],
        emailPlaceholder: translations[1],
        passwordPlaceholder: translations[2],
        loginButton: translations[3],
        loggingIn: translations[4],
        noAccount: translations[5],
        registerHere: translations[6],
        featuredBy: translations[7],
      });
    };

    fetchTranslations();
  }, [language]);

  const inputStyles =
    "w-full px-4 py-3 mb-4 border border-cyan-500 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
      {/* 메인 컨텐츠 */}
      <main className="flex flex-col items-center mt-5">
        {/* 로고 섹션 */}
        <Image src={Logo} alt="BitBoostX Logo" width={240} height={240} />

        {/* 로그인 폼 */}
        <div className="w-[80%] bg-gray-900/80 p-8 rounded-lg shadow-2xl w-full max-w-md border border-cyan-500 mt-5">
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

      {/* 하단 섹션 */}
      <footer className="flex flex-col items-center justify-center mt-10">
        <div className="relative w-64 h-64 mb-4">
          <h1 className="text-3xl font-bold text-center text-cyan-500 mb-4">
            {translatedTexts.featuredBy}
          </h1>
          <Image src={Bn} alt="binance" width={240} height={240} />
        </div>
      </footer>
    </div>
  );
}
