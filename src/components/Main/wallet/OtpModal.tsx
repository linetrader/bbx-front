// src/components/Main/wallet/OtpModal.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  otp,
  onClose,
  onConfirm,
  setOtp,
}) => {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    title: "Google OTP 입력",
    description: "출금을 확인하려면 Google OTP를 입력하세요.",
    placeholder: "OTP 입력",
    cancelButton: "취소",
    confirmButton: "확인",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const keys = [
        { key: "title", text: "Google OTP 입력" },
        {
          key: "description",
          text: "출금을 확인하려면 Google OTP를 입력하세요.",
        },
        { key: "placeholder", text: "OTP 입력" },
        { key: "cancelButton", text: "취소" },
        { key: "confirmButton", text: "확인" },
      ];

      try {
        const translations = await Promise.all(
          keys.map((item) => fetchTranslation(item.text, language))
        );

        const updatedTexts = keys.reduce(
          (acc, item, index) => {
            acc[item.key as keyof typeof translatedTexts] = translations[index];
            return acc;
          },
          { ...translatedTexts }
        );

        setTranslatedTexts(updatedTexts);
      } catch (error) {
        console.error("[ERROR] Failed to fetch translations:", error);
      }
    };

    fetchTranslations();
  }, [language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-[90%] max-w-md p-6 bg-gray-800 rounded-lg border border-cyan-500 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4 tracking-wide">
          {translatedTexts.title}
        </h2>
        <p className="text-sm text-gray-300 mb-6 text-center">
          {translatedTexts.description}
        </p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder={translatedTexts.placeholder}
          className="w-full px-4 py-2 mb-6 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-900 text-white placeholder-gray-500"
        />
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-1/2 px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            {translatedTexts.cancelButton}
          </button>
          <button
            onClick={() => onConfirm(otp)}
            className="w-1/2 px-4 py-2 text-sm font-semibold text-black bg-cyan-500 rounded hover:bg-cyan-400 transition-colors"
          >
            {translatedTexts.confirmButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
