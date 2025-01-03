// src/components/Profile.tsx

"use client";

import React, { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import Modal from "./Modal";

export default function Profile() {
  const {
    userData,
    loading,
    error,
    otpData,
    isOtpEnabled,
    handleGenerateOtp,
    handleVerifyAndSaveOtp,
    setIsOtpEnabled,
  } = useProfile();

  const [isModalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<"qr" | "verify">("qr");
  const [otpInput, setOtpInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setSuccessMessage("OTP successfully registered.");
      setIsOtpEnabled(true);
      setModalOpen(false);
      setOtpInput("");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setOtpInput("");
  };

  const containerStyles =
    "bg-gray-900/80 p-8 rounded-lg shadow-2xl w-full max-w-md border border-cyan-500";
  const buttonStyles =
    "mt-4 w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded shadow-lg";
  const inputStyles =
    "w-full px-4 py-3 border border-cyan-500 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500";

  return (
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow flex items-start justify-center pt-24">
        <div className={containerStyles}>
          <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            Profile
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
            <div className="text-center text-gray-500">Loading...</div>
          ) : userData ? (
            <div className="text-sm text-gray-300">
              <div className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800">
                <p className="mb-2">
                  <span className="font-bold text-cyan-400">Username:</span>{" "}
                  {userData.username}
                </p>
                <p className="mb-2">
                  <span className="font-bold text-cyan-400">Email:</span>{" "}
                  {userData.email}
                </p>
                <p className="mb-2">
                  <span className="font-bold text-cyan-400">First Name:</span>{" "}
                  {userData.firstname}
                </p>
                <p className="mb-2">
                  <span className="font-bold text-cyan-400">Last Name:</span>{" "}
                  {userData.lastname}
                </p>
                <p className="mb-2 flex items-center">
                  <span className="font-bold text-cyan-400">OTP Status:</span>
                  <span className="ml-2">{isOtpEnabled ? "On" : "Off"}</span>
                  {!isOtpEnabled && (
                    <button
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-1 px-2 rounded ml-4"
                      onClick={handleGenerateOtpWithModal}
                    >
                      Generate OTP
                    </button>
                  )}
                </p>
              </div>
              {successMessage && (
                <div className="bg-green-500 text-black border border-green-400 px-4 py-3 rounded mb-4">
                  {successMessage}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No profile data found.
            </div>
          )}
        </div>
      </main>
      {otpData && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {step === "qr" ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                Your OTP
              </h2>
              <p className="text-cyan-400 font-bold mb-2">Scan this QR Code:</p>
              <img
                src={otpData.qrCode}
                alt="OTP QR Code"
                className="mt-2 border border-cyan-500 rounded mb-4"
              />
              <p className="text-sm text-gray-400">
                <span className="font-bold text-cyan-400">Manual Key:</span>{" "}
                {otpData.manualKey}
              </p>
              <button className={buttonStyles} onClick={handleNextStep}>
                Next
              </button>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                Verify OTP
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Enter the 6-digit OTP code from your authenticator app.
              </p>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter OTP"
                className={inputStyles}
              />
              <button className={buttonStyles} onClick={handleVerifyOtp}>
                Verify
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
