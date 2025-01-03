// src/app/Login/page.tsx

"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next"; // useTranslation 훅 임포트
import { useLogin } from "@/hooks/useLogin";
import Logo from "../../assets/images/logos/LOGO.png";
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

  const { t } = useTranslation("login"); // "login" 네임스페이스로 번역 키 사용
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const inputStyles =
    "w-full px-4 py-3 mb-4 border border-cyan-500 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col">
      {/* 메인 컨텐츠 */}
      <main className="flex flex-col items-center -mt-10">
        {/* 로고 섹션 */}
        <div className="relative w-64 h-64 mb-6">
          <Image
            src={Logo}
            alt="BitBoostX Logo"
            width={240}
            height={240}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-contain"
          />
        </div>

        {/* 로그인 폼 */}
        <div className="w-[80%] bg-gray-900/80 p-8 rounded-lg shadow-2xl w-full max-w-md border border-cyan-500 -mt-20">
          <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            {t("loginTitle")} {/* 번역 키 사용 */}
          </h1>
          {error && (
            <div
              className="bg-red-600/70 text-white border border-red-500 px-4 py-3 rounded mb-4 text-center"
              role="alert"
              aria-live="polite"
            >
              {t("error", { error })} {/* 번역 키에 에러 메시지 전달 */}
            </div>
          )}
          <input
            ref={emailInputRef}
            type="email"
            placeholder={t("emailPlaceholder")} // 번역 키 사용
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyles}
          />
          <input
            ref={passwordInputRef}
            type="password"
            placeholder={t("passwordPlaceholder")} // 번역 키 사용
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputStyles}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            aria-disabled={loading}
            className={`w-full py-3 rounded font-bold tracking-wider shadow-lg ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-400 text-black"
            }`}
          >
            {loading ? t("loggingIn") : t("loginButton")} {/* 번역 키 사용 */}
          </button>
          <p className="text-center text-gray-400 mt-4">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-cyan-500 hover:underline">
              {t("registerLink")}
            </Link>
          </p>
        </div>
      </main>

      {/* 하단 섹션 */}
      <footer className="flex flex-col items-center justify-center mt-10">
        <div className="relative w-64 h-64 mb-4">
          <h1 className="text-3xl font-bold text-center text-cyan-500 mb-4">
            {t("featuredBy")} {/* 번역 키 사용 */}
          </h1>
          <Image
            src={Bn}
            alt={t("binanceAlt")}
            width={240}
            height={240}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-contain"
          />
        </div>
      </footer>
    </div>
  );
}
