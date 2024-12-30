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
    setIsOtpEnabled, // 추가
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
      setIsOtpEnabled(true); // Update the OTP status to 'On'
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300">
      <div className="flex-grow flex items-start justify-center pt-24">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-yellow-600 mb-6">
            Profile
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : userData ? (
            <div className="text-sm text-gray-300">
              <div className="mb-4 p-4 border rounded border-gray-700 bg-gray-800">
                <p className="mb-2">
                  <span className="font-bold text-yellow-600">Username:</span>{" "}
                  {userData.username}
                </p>
                <p className="mb-2">
                  <span className="font-bold text-yellow-600">Email:</span>{" "}
                  {userData.email}
                </p>
                <p className="mb-2">
                  <span className="font-bold text-yellow-600">First Name:</span>{" "}
                  {userData.firstname}
                </p>
                <p className="mb-2">
                  <span className="font-bold text-yellow-600">Last Name:</span>{" "}
                  {userData.lastname}
                </p>
                <p className="mb-2 flex items-center">
                  <span className="font-bold text-yellow-600">OTP Status:</span>{" "}
                  <span className="ml-2">{isOtpEnabled ? "On" : "Off"}</span>
                  {!isOtpEnabled && (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-gray-300 font-bold py-1 px-2 rounded ml-4"
                      onClick={handleGenerateOtpWithModal}
                    >
                      Generate OTP
                    </button>
                  )}
                </p>
              </div>
              {successMessage && (
                <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-3 rounded mb-4">
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
      </div>
      {otpData && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {step === "qr" ? (
            <div className="p-6">
              <h2 className="text-xl font-bold text-yellow-600 mb-4">
                Your OTP
              </h2>
              <p className="text-yellow-600 font-bold mb-2">
                Scan this QR Code:
              </p>
              <img
                src={otpData.qrCode}
                alt="OTP QR Code"
                className="mt-2 border border-gray-700 rounded mb-4"
              />
              <p className="text-sm text-gray-400">
                <span className="font-bold text-yellow-600">Manual Key:</span>{" "}
                {otpData.manualKey}
              </p>
              <button
                className="mt-4 w-full py-2 bg-yellow-500 hover:bg-yellow-700 text-gray-300 font-bold rounded"
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-bold text-yellow-600 mb-4">
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
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gray-800 text-gray-300 mb-4"
              />
              <button
                className="mt-4 w-full py-2 bg-green-500 hover:bg-green-700 text-gray-300 font-bold rounded"
                onClick={handleVerifyOtp}
              >
                Verify
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
