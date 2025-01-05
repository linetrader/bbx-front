"use client";

import React, { useState, useEffect } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

interface OtpSectionProps {
  otpData: {
    qrCode: string;
    manualKey: string;
  } | null;
  step: "qr" | "verify";
  setStep: (step: "qr" | "verify") => void;
  handleVerifyOtp: (otp: string) => Promise<void>;
  onClose: () => void; // 모달 닫기 함수
}

export default function OtpSection({
  otpData,
  step,
  setStep,
  handleVerifyOtp,
  onClose,
}: OtpSectionProps) {
  const { language } = useTranslationContext();
  const [otpInput, setOtpInput] = useState("");
  const [translatedTexts, setTranslatedTexts] = useState({
    scanQrCode: "QR 코드를 스캔하세요",
    manualKey: "수동 키",
    verifyOtp: "OTP 확인",
    cancelButton: "취소",
    enterOtpPlaceholder: "OTP를 입력하세요",
    submitOtp: "OTP 제출",
    pleaseEnterOtp: "OTP를 입력하세요.",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const keys = [
        { key: "scanQrCode", text: "QR 코드를 스캔하세요" },
        { key: "manualKey", text: "수동 키" },
        { key: "verifyOtp", text: "OTP 확인" },
        { key: "cancelButton", text: "취소" },
        { key: "enterOtpPlaceholder", text: "OTP를 입력하세요" },
        { key: "submitOtp", text: "OTP 제출" },
        { key: "pleaseEnterOtp", text: "OTP를 입력하세요." },
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

  const onSubmitOtp = async () => {
    if (otpInput.trim() === "") {
      alert(translatedTexts.pleaseEnterOtp);
      return;
    }
    await handleVerifyOtp(otpInput);
    setOtpInput(""); // 입력 필드 초기화
    onClose(); // 모달 닫기
  };

  return otpData ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
        <button
          className="text-gray-400 hover:text-gray-200 font-bold text-xl absolute top-4 right-4"
          onClick={onClose}
        >
          &times;
        </button>
        {step === "qr" ? (
          <>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              {translatedTexts.scanQrCode}
            </h2>
            <img
              src={otpData.qrCode}
              alt="QR Code"
              className="mb-4 border border-cyan-500 rounded"
            />
            <p className="text-sm text-gray-400">
              <span className="font-bold text-cyan-400">
                {translatedTexts.manualKey}:
              </span>{" "}
              {otpData.manualKey}
            </p>
            <div className="flex gap-4">
              <button
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded"
                onClick={onClose}
              >
                {translatedTexts.cancelButton}
              </button>
              <button
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded"
                onClick={() => setStep("verify")}
              >
                {translatedTexts.verifyOtp}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              {translatedTexts.verifyOtp}
            </h2>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder={translatedTexts.enterOtpPlaceholder}
              className="w-full px-4 py-3 border border-cyan-500 rounded bg-gray-800 text-white mb-4"
            />
            <div className="flex gap-4">
              <button
                className="w-1/2 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded"
                onClick={onClose}
              >
                {translatedTexts.cancelButton}
              </button>
              <button
                className="w-1/2 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded"
                onClick={onSubmitOtp}
              >
                {translatedTexts.submitOtp}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null;
}
