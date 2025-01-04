// src/components/Profile/OtpSection.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import Modal from "./Modal";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

interface OtpSectionProps {
  setIsOtpEnabled: (enabled: boolean) => void;
}

export default function OtpSection({ setIsOtpEnabled }: OtpSectionProps) {
  const { otpData, handleGenerateOtp, handleVerifyAndSaveOtp } = useProfile();

  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    yourOtp: "Your OTP",
    scanQr: "Scan this QR Code:",
    manualKey: "Manual Key",
    next: "Next",
    verifyOtp: "Verify OTP",
    enterOtpInstruction:
      "Enter the 6-digit OTP code from your authenticator app.",
    verify: "Verify",
    otpSuccess: "OTP successfully registered.",
    invalidOtp: "Invalid OTP. Please try again.",
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<"qr" | "verify">("qr");
  const [otpInput, setOtpInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("Your OTP", language),
        translateText("Scan this QR Code:", language),
        translateText("Manual Key", language),
        translateText("Next", language),
        translateText("Verify OTP", language),
        translateText(
          "Enter the 6-digit OTP code from your authenticator app.",
          language
        ),
        translateText("Verify", language),
        translateText("OTP successfully registered.", language),
        translateText("Invalid OTP. Please try again.", language),
      ]);

      setTranslatedTexts({
        yourOtp: translations[0],
        scanQr: translations[1],
        manualKey: translations[2],
        next: translations[3],
        verifyOtp: translations[4],
        enterOtpInstruction: translations[5],
        verify: translations[6],
        otpSuccess: translations[7],
        invalidOtp: translations[8],
      });
    };

    fetchTranslations();
  }, [language]);

  const handleGenerateOtpWithModal = async () => {
    await handleGenerateOtp();
    setStep("qr");
    setModalOpen(true);
  };

  const handleNextStep = () => {
    setStep("verify");
  };

  const handleVerifyOtp = async () => {
    const isVerified = await handleVerifyAndSaveOtp(otpInput);
    if (isVerified) {
      setSuccessMessage(translatedTexts.otpSuccess);
      setIsOtpEnabled(true);
      setModalOpen(false);
      setOtpInput("");
    } else {
      alert(translatedTexts.invalidOtp);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setOtpInput("");
  };

  const buttonStyles =
    "mt-4 w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded shadow-lg";
  const inputStyles =
    "w-full px-4 py-3 border border-cyan-500 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500";

  return (
    <div>
      {otpData && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {step === "qr" ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                {translatedTexts.yourOtp}
              </h2>
              <p className="text-cyan-400 font-bold mb-2">
                {translatedTexts.scanQr}
              </p>
              <img
                src={otpData.qrCode}
                alt="OTP QR Code"
                className="mt-2 border border-cyan-500 rounded mb-4"
              />
              <p className="text-sm text-gray-400">
                <span className="font-bold text-cyan-400">
                  {translatedTexts.manualKey}:
                </span>{" "}
                {otpData.manualKey}
              </p>
              <button className={buttonStyles} onClick={handleNextStep}>
                {translatedTexts.next}
              </button>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                {translatedTexts.verifyOtp}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                {translatedTexts.enterOtpInstruction}
              </p>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter OTP"
                className={inputStyles}
              />
              <button className={buttonStyles} onClick={handleVerifyOtp}>
                {translatedTexts.verify}
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
