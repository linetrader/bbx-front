// src/app/register/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

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
    registerTitle: "Sign Up",
    usernamePlaceholder: "Username",
    firstnamePlaceholder: "First Name",
    lastnamePlaceholder: "Last Name",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    confirmPasswordPlaceholder: "Confirm Password",
    referrerPlaceholder: "Referrer (Optional)",
    registering: "Registering...",
    registerButton: "Register",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("Sign Up", language),
        translateText("Username", language),
        translateText("First Name", language),
        translateText("Last Name", language),
        translateText("Email", language),
        translateText("Password", language),
        translateText("Confirm Password", language),
        translateText("Referrer (Optional)", language),
        translateText("Registering...", language),
        translateText("Register", language),
        translateText("Already have an account?", language),
        translateText("Login here", language),
      ]);

      setTranslatedTexts({
        registerTitle: translations[0],
        usernamePlaceholder: translations[1],
        firstnamePlaceholder: translations[2],
        lastnamePlaceholder: translations[3],
        emailPlaceholder: translations[4],
        passwordPlaceholder: translations[5],
        confirmPasswordPlaceholder: translations[6],
        referrerPlaceholder: translations[7],
        registering: translations[8],
        registerButton: translations[9],
        alreadyHaveAccount: translations[10],
        loginHere: translations[11],
      });
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
      <main className="w-[85%] bg-gray-900/80 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-cyan-500 -mt-20">
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
