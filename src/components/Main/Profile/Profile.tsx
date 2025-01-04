// src/components/Profile/ProfileMain.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";
import OtpSection from "./OtpSection";
import Modal from "./Modal";

export default function ProfileMain() {
  const {
    userData,
    loading,
    error,
    isOtpEnabled,
    setIsOtpEnabled,
    otpData,
    handleGenerateOtp,
  } = useProfile();

  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    profileTitle: "프로필",
    loading: "Loading...",
    noProfileData: "No profile data found.",
    username: "Username",
    email: "Email",
    firstName: "First Name",
    lastName: "Last Name",
    otpStatus: "OTP Status",
    otpOn: "On",
    otpOff: "Off",
    generateOtp: "Generate OTP",
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<"qr" | "verify">("qr");

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("프로필", language),
        translateText("Loading...", language),
        translateText("No profile data found.", language),
        translateText("Username", language),
        translateText("Email", language),
        translateText("First Name", language),
        translateText("Last Name", language),
        translateText("OTP Status", language),
        translateText("On", language),
        translateText("Off", language),
        translateText("Generate OTP", language),
      ]);

      setTranslatedTexts({
        profileTitle: translations[0],
        loading: translations[1],
        noProfileData: translations[2],
        username: translations[3],
        email: translations[4],
        firstName: translations[5],
        lastName: translations[6],
        otpStatus: translations[7],
        otpOn: translations[8],
        otpOff: translations[9],
        generateOtp: translations[10],
      });
    };

    fetchTranslations();
  }, [language]);

  const containerStyles =
    "bg-gray-900/80 p-8 rounded-lg shadow-2xl w-full max-w-md border border-cyan-500";

  const handleGenerateOtpWithModal = async () => {
    await handleGenerateOtp();
    setStep("qr");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow flex items-start justify-center pt-24">
        <div className={containerStyles}>
          <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            {translatedTexts.profileTitle}
          </h1>
          {error && (
            <div
              className="bg-red-600/70 text-white border border-red-500 px-4 py-3 rounded mb-4 text-center"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500">
              {translatedTexts.loading}
            </div>
          ) : userData ? (
            <div className="text-sm text-gray-300">
              <div className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800">
                <p className="mb-2">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.username}:
                  </span>{" "}
                  {userData.username}
                </p>
                <p className="mb-2">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.email}:
                  </span>{" "}
                  {userData.email}
                </p>
                <p className="mb-2">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.firstName}:
                  </span>{" "}
                  {userData.firstname}
                </p>
                <p className="mb-2">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.lastName}:
                  </span>{" "}
                  {userData.lastname}
                </p>
                <p className="mb-2 flex items-center">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.otpStatus}:
                  </span>
                  <span className="ml-2">
                    {isOtpEnabled
                      ? translatedTexts.otpOn
                      : translatedTexts.otpOff}
                  </span>
                  {!isOtpEnabled && (
                    <button
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-1 px-2 rounded ml-4"
                      onClick={handleGenerateOtpWithModal}
                    >
                      {translatedTexts.generateOtp}
                    </button>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              {translatedTexts.noProfileData}
            </div>
          )}
        </div>
      </main>
      <OtpSection setIsOtpEnabled={setIsOtpEnabled} />

      {otpData && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {step === "qr" ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                {translatedTexts.generateOtp}
              </h2>
              <p className="text-cyan-400 font-bold mb-2">QR Code</p>
              <img
                src={otpData.qrCode}
                alt="OTP QR Code"
                className="mt-2 border border-cyan-500 rounded mb-4"
              />
              <p className="text-sm text-gray-400">
                Manual Key: {otpData.manualKey}
              </p>
              <button
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-1 px-4 rounded"
                onClick={() => setStep("verify")}
              >
                Next
              </button>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                Verify OTP
              </h2>
              <input
                type="text"
                className="w-full px-4 py-2 border border-cyan-500 rounded bg-gray-800 text-white"
              />
              <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-1 px-4 rounded mt-4">
                Verify
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
