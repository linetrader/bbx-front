// components/Wallet.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import OtpModal from "../../OtpModal";
import DepositSection from "./DepositSection";
import WithdrawSection from "./WithdrawSection";

enum ViewMode {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

export default function Wallet() {
  const {
    walletData,
    miningData,
    loading,
    error,
    createWallet,
    withdrawalAmounts,
    handleInputChange,
    handleWithdrawClick,
    handleConfirmWithdraw,
    otp,
    setOtp,
    fetchDepositWallet,
    fetchMiningData,
    fetchPendingWithdrawals,
    pendingWithdrawals,
  } = useWallet();

  const [isOtpModalOpen, setOtpModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DEPOSIT);

  useEffect(() => {
    if (viewMode === ViewMode.DEPOSIT) {
      fetchDepositWallet();
      fetchMiningData();
    } else if (viewMode === ViewMode.WITHDRAW) {
      fetchPendingWithdrawals();
    }
  }, [viewMode]);

  return (
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow pt-10">
        <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setViewMode(ViewMode.DEPOSIT)}
              className={`px-4 py-2 rounded font-semibold transition-colors text-sm ${
                viewMode === ViewMode.DEPOSIT
                  ? "bg-cyan-500 text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setViewMode(ViewMode.WITHDRAW)}
              className={`px-4 py-2 rounded font-semibold transition-colors text-sm ${
                viewMode === ViewMode.WITHDRAW
                  ? "bg-cyan-500 text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Withdraw
            </button>
          </div>

          {viewMode === ViewMode.DEPOSIT ? (
            <DepositSection
              error={error}
              loading={loading}
              walletData={walletData}
              miningData={miningData}
              createWallet={createWallet}
            />
          ) : (
            <WithdrawSection
              withdrawalAmounts={withdrawalAmounts}
              handleInputChange={handleInputChange}
              handleWithdrawClick={handleWithdrawClick}
              loading={loading}
              pendingWithdrawals={pendingWithdrawals}
            />
          )}
        </div>
      </main>

      <OtpModal
        isOpen={isOtpModalOpen}
        otp={otp}
        setOtp={setOtp}
        onClose={() => setOtpModalOpen(false)}
        onConfirm={(otpValue) => {
          handleConfirmWithdraw(otpValue);
          setOtpModalOpen(false);
        }}
      />
    </div>
  );
}
