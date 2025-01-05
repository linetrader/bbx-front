// src/app/register/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

export default function Register() {
  const {
    formData,
    setFormData,
    handleRegister,
    loading,
    error,
    requiredFields,
  } = useRegister();

  const router = useRouter();
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    registerTitle: "회원가입",
    usernamePlaceholder: "사용자명",
    firstnamePlaceholder: "이름",
    lastnamePlaceholder: "성",
    emailPlaceholder: "이메일",
    passwordPlaceholder: "비밀번호",
    confirmPasswordPlaceholder: "비밀번호 확인",
    referrerPlaceholder: "추천인 (선택사항)",
    registering: "회원가입 중...",
    registerButton: "가입하기",
    alreadyHaveAccount: "이미 계정이 있으신가요?",
    loginHere: "로그인하기",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "registerTitle", text: "회원가입" },
          { key: "usernamePlaceholder", text: "사용자명" },
          { key: "firstnamePlaceholder", text: "이름" },
          { key: "lastnamePlaceholder", text: "성" },
          { key: "emailPlaceholder", text: "이메일" },
          { key: "passwordPlaceholder", text: "비밀번호" },
          { key: "confirmPasswordPlaceholder", text: "비밀번호 확인" },
          { key: "referrerPlaceholder", text: "추천인 (선택사항)" },
          { key: "registering", text: "회원가입 중..." },
          { key: "registerButton", text: "가입하기" },
          { key: "alreadyHaveAccount", text: "이미 계정이 있으신가요?" },
          { key: "loginHere", text: "로그인하기" },
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const inputStyles =
    "w-full px-4 py-3 mb-4 border border-cyan-500 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center overflow-y-auto scrollbar-hide">
      {/* Main Content */}
      <main className="w-[85%] bg-gray-900/80 p-8 rounded-lg shadow-2xl max-w-lg border border-cyan-500 -mt-20">
        <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
          {translatedTexts.registerTitle}
        </h1>
        {error && (
          <div className="bg-red-600/70 text-white border border-red-500 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form>
          <input
            type="text"
            placeholder={translatedTexts.usernamePlaceholder}
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className={`${inputStyles} ${
              requiredFields.includes("username") ? "border-red-500" : ""
            }`}
          />
          <input
            type="text"
            placeholder={translatedTexts.firstnamePlaceholder}
            value={formData.firstname}
            onChange={(e) => handleChange("firstname", e.target.value)}
            className={`${inputStyles} ${
              requiredFields.includes("firstname") ? "border-red-500" : ""
            }`}
          />
          <input
            type="text"
            placeholder={translatedTexts.lastnamePlaceholder}
            value={formData.lastname}
            onChange={(e) => handleChange("lastname", e.target.value)}
            className={`${inputStyles} ${
              requiredFields.includes("lastname") ? "border-red-500" : ""
            }`}
          />
          <input
            type="email"
            placeholder={translatedTexts.emailPlaceholder}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`${inputStyles} ${
              requiredFields.includes("email") ? "border-red-500" : ""
            }`}
          />
          <input
            type="password"
            placeholder={translatedTexts.passwordPlaceholder}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`${inputStyles} ${
              requiredFields.includes("password") ? "border-red-500" : ""
            }`}
          />
          <input
            type="password"
            placeholder={translatedTexts.confirmPasswordPlaceholder}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={inputStyles}
          />
          <input
            type="text"
            placeholder={translatedTexts.referrerPlaceholder}
            value={formData.referrer}
            onChange={(e) => handleChange("referrer", e.target.value)}
            className={inputStyles}
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-3 rounded font-bold tracking-wider shadow-lg ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-400 text-black"
            }`}
          >
            {loading
              ? translatedTexts.registering
              : translatedTexts.registerButton}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-400">
            {translatedTexts.alreadyHaveAccount}{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-cyan-500 cursor-pointer hover:underline"
            >
              {translatedTexts.loginHere}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
