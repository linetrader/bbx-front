// src/components/Main/Profile/Profile.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";
import OtpSection from "./OtpSection";

export default function Profile() {
  const {
    userData,
    loading,
    error,
    isOtpEnabled,
    otpData,
    setIsOtpEnabled,
    handleGenerateOtp,
    handleVerifyAndSaveOtp,
  } = useProfile();

  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    profileTitle: "프로필",
    loading: "로딩 중...",
    noProfileData: "프로필 데이터를 찾을 수 없습니다.",
    username: "사용자 이름",
    email: "이메일",
    firstName: "이름",
    lastName: "성",
    otpStatus: "OTP 상태",
    otpOn: "활성화",
    otpOff: "비활성화",
    generateOtp: "OTP 생성",
    referralSection: "레퍼럴",
    referralLink: "레퍼럴 링크",
    copyLink: "링크 복사",
    copySuccess: "링크가 복사되었습니다!",
  });

  const [step, setStep] = useState<"qr" | "verify">("qr");
  const [isModalOpen, setModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchTranslations = async () => {
      const keys = [
        { key: "profileTitle", text: "프로필" },
        { key: "loading", text: "로딩 중..." },
        { key: "noProfileData", text: "프로필 데이터를 찾을 수 없습니다." },
        { key: "username", text: "사용자 이름" },
        { key: "email", text: "이메일" },
        { key: "firstName", text: "이름" },
        { key: "lastName", text: "성" },
        { key: "otpStatus", text: "OTP 상태" },
        { key: "otpOn", text: "활성화" },
        { key: "otpOff", text: "비활성화" },
        { key: "generateOtp", text: "OTP 생성" },
        { key: "referralSection", text: "레퍼럴" },
        { key: "referralLink", text: "레퍼럴 링크" },
        { key: "copyLink", text: "링크 복사" },
        { key: "copySuccess", text: "링크가 복사되었습니다!" },
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

  const handleGenerateOtpWithState = async () => {
    const otp = await handleGenerateOtp();
    if (otp) {
      setStep("qr");
      setModalOpen(true);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const isVerified = await handleVerifyAndSaveOtp(otp);
    if (isVerified) {
      setIsOtpEnabled(true);
      alert("OTP 인증이 성공적으로 완료되었습니다!");
    } else {
      alert("잘못된 OTP입니다. 다시 시도해주세요.");
    }
  };

  const handleCopyReferralLink = () => {
    if (userData?.username) {
      const referralLink = `https://bitboost-x.com/register?ref=${userData.username}`;
      navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const containerStyles =
    "bg-gray-900/80 p-8 rounded-lg shadow-2xl w-full max-w-md border border-cyan-500";

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
            <div className="text-left">
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
                      onClick={handleGenerateOtpWithState}
                    >
                      {translatedTexts.generateOtp}
                    </button>
                  )}
                </p>
              </div>

              {/* Referral Section */}
              <div className="mt-6 p-4 border rounded border-cyan-500 bg-gray-800">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">
                  {translatedTexts.referralSection}
                </h2>
                <p className="mb-4">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.referralLink}:
                  </span>{" "}
                  <span className="text-cyan-300">
                    https://bitboost-x.com/register?ref={userData.username}
                  </span>
                </p>
                <button
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-1 px-4 rounded"
                  onClick={handleCopyReferralLink}
                >
                  {translatedTexts.copyLink}
                </button>
                {copySuccess && (
                  <p className="text-green-400 mt-2">
                    {translatedTexts.copySuccess}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              {translatedTexts.noProfileData}
            </div>
          )}
        </div>
      </main>
      {isModalOpen && (
        <OtpSection
          otpData={otpData}
          step={step}
          setStep={setStep}
          handleVerifyOtp={handleVerifyOtp}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
