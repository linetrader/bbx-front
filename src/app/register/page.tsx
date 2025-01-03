"use client";

import React from "react";
import { useRegister } from "@/hooks/useRegister";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next"; // 번역 훅 가져오기

export default function Register() {
  const {
    formData,
    setFormData,
    handleRegister,
    loading,
    error,
    requiredFields,
  } = useRegister();

  const { t } = useTranslation("register"); // 번역 함수 가져오기
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center overflow-y-auto scrollbar-hide">
      {/* 메인 컨텐츠 */}
      <main className="w-[85%] bg-gray-900/80 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-cyan-500 -mt-20">
        <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
          {t("registerTitle")}
        </h1>
        {error && (
          <div className="bg-red-600/70 text-white border border-red-500 px-4 py-3 rounded mb-4 text-center">
            {t("errorMessage", { error })}
          </div>
        )}
        <form>
          <input
            type="text"
            placeholder={t("usernamePlaceholder")}
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className={`w-full px-4 py-3 mb-4 border ${
              requiredFields.includes("username")
                ? "border-red-500"
                : "border-cyan-500"
            } rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500`}
          />
          <input
            type="text"
            placeholder={t("firstnamePlaceholder")}
            value={formData.firstname}
            onChange={(e) => handleChange("firstname", e.target.value)}
            className={`w-full px-4 py-3 mb-4 border ${
              requiredFields.includes("firstname")
                ? "border-red-500"
                : "border-cyan-500"
            } rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500`}
          />
          <input
            type="text"
            placeholder={t("lastnamePlaceholder")}
            value={formData.lastname}
            onChange={(e) => handleChange("lastname", e.target.value)}
            className={`w-full px-4 py-3 mb-4 border ${
              requiredFields.includes("lastname")
                ? "border-red-500"
                : "border-cyan-500"
            } rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500`}
          />
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full px-4 py-3 mb-4 border ${
              requiredFields.includes("email")
                ? "border-red-500"
                : "border-cyan-500"
            } rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500`}
          />
          <input
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`w-full px-4 py-3 mb-4 border ${
              requiredFields.includes("password")
                ? "border-red-500"
                : "border-cyan-500"
            } rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500`}
          />
          <input
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="w-full px-4 py-3 mb-4 border border-cyan-500 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder={t("referrerPlaceholder")}
            value={formData.referrer}
            onChange={(e) => handleChange("referrer", e.target.value)}
            className="w-full px-4 py-3 mb-6 border border-cyan-500 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500"
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
            {loading ? t("registeringButton") : t("registerButton")}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-400">
            {t("alreadyHaveAccount")}{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-cyan-500 cursor-pointer hover:underline"
            >
              {t("loginHere")}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
