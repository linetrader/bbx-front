// components/Wallet.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import OtpModal from "./OtpModal";

type TokenType = "usdt" | "doge" | "btc";

enum ViewMode {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

export default function Wallet() {
  const {
    walletData,
    loading,
    error,
    createWallet,
    withdrawalAmounts,
    handleInputChange,
    handleWithdrawClick,
    handleConfirmWithdraw,
    otp,
    setOtp,
    selectedToken,
    pendingWithdrawals,
    fetchPendingWithdrawals,
  } = useWallet();

  const [isOtpModalOpen, setOtpModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DEPOSIT);

  useEffect(() => {
    if (viewMode === ViewMode.WITHDRAW) {
      fetchPendingWithdrawals();
    }
  }, [viewMode]);

  return (
    <div
      className="overflow-y-auto"
      style={{
        height: "calc(100vh - 200px)",
        paddingBottom: "1rem",
        scrollbarWidth: "none", // For Firefox
        msOverflowStyle: "none", // For IE and Edge
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
        <main className="max-w-4xl mx-auto px-4 py-8 pt-0">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setViewMode(ViewMode.DEPOSIT)}
                className={`px-4 py-2 rounded font-semibold transition-colors text-sm ${
                  viewMode === ViewMode.DEPOSIT
                    ? "bg-yellow-500 text-gray-800"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setViewMode(ViewMode.WITHDRAW)}
                className={`px-4 py-2 rounded font-semibold transition-colors text-sm ${
                  viewMode === ViewMode.WITHDRAW
                    ? "bg-yellow-500 text-gray-800"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Withdraw
              </button>
            </div>

            {viewMode === ViewMode.DEPOSIT && (
              <div>
                {/* Deposit Section */}
                <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
                  Deposit Wallet
                </h1>
                {error && (
                  <div
                    className={`px-4 py-3 rounded mb-4 text-sm border ${
                      error === "Wallet not found."
                        ? "bg-yellow-100 text-yellow-700 border-yellow-600"
                        : "bg-red-100 text-red-700 border-red-400"
                    }`}
                  >
                    {error === "Wallet not found."
                      ? "Wallet not found. Please create a wallet."
                      : error}
                  </div>
                )}
                {loading ? (
                  <div className="text-center text-gray-400 font-medium text-sm">
                    Loading...
                  </div>
                ) : walletData ? (
                  <div className="text-left">
                    <div className="mb-4 p-4 border rounded border-gray-700 bg-gray-800">
                      <div className="mb-4">
                        <p className="text-yellow-600 font-bold">
                          Wallet Address:
                        </p>
                        <p className="font-mono break-all text-gray-300">
                          {walletData.address}
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-yellow-600 font-bold">
                          USDT Balance:
                        </p>
                        <p className="text-gray-300">
                          {walletData.usdtBalance}
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-yellow-600 font-bold">
                          DOGE Balance:
                        </p>
                        <p className="text-gray-300">
                          {walletData.dogeBalance}
                        </p>
                      </div>
                      <div className="mb-4">
                        <p className="text-yellow-600 font-bold">
                          BTC Balance:
                        </p>
                        <p className="text-gray-300">{walletData.btcBalance}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={createWallet}
                    disabled={loading}
                    className={`w-full py-2 mt-4 rounded font-semibold shadow-md transition-colors text-white text-sm ${
                      loading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    {loading ? "Creating Wallet..." : "Create Wallet"}
                  </button>
                )}
              </div>
            )}

            {viewMode === ViewMode.WITHDRAW && (
              <div>
                {/* Withdrawal Section */}
                <h1 className="text-3xl font-bold text-center text-yellow-600 mb-6">
                  Withdraw Wallet
                </h1>
                <div className="mb-4 p-4 border rounded border-gray-700 bg-gray-800">
                  {(["usdt", "doge", "btc"] as TokenType[]).map((token) => (
                    <div key={token} className="mb-4">
                      <label
                        htmlFor={`${token}-withdraw`}
                        className="block text-sm font-semibold text-gray-300 mb-2"
                      >
                        {token.toUpperCase()} Amount
                      </label>
                      <div className="flex items-center gap-6">
                        <input
                          id={`${token}-withdraw`}
                          type="number"
                          step="0.000001"
                          value={withdrawalAmounts[token]}
                          onChange={(e) =>
                            handleInputChange(token, e.target.value)
                          }
                          placeholder={`Enter ${token.toUpperCase()} amount`}
                          className="w-1/2 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-gray-800 text-white placeholder-gray-400"
                        />
                        <button
                          onClick={() => {
                            handleWithdrawClick(token);
                            setOtpModalOpen(true);
                          }}
                          disabled={loading}
                          className={`px-4 py-2 rounded-r font-semibold shadow-md transition-colors text-white text-sm ${
                            loading
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-400"
                          }`}
                        >
                          {loading ? "Processing..." : "Withdraw"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Withdraw Pending Section */}
                <h1 className="text-3xl font-bold text-center text-yellow-600 mb-6">
                  Withdraw Pending
                </h1>
                <div className="mb-4 p-4 border rounded border-gray-700 bg-gray-800">
                  {pendingWithdrawals.length > 0 ? (
                    <ul className="space-y-4">
                      {pendingWithdrawals.map((withdrawal, index) => (
                        <li key={index} className="p-4 bg-gray-700 rounded">
                          <p className="text-sm text-gray-300">
                            <strong>Currency:</strong> {withdrawal.currency}
                          </p>
                          <p className="text-sm text-gray-300">
                            <strong>Amount:</strong> {withdrawal.amount}
                          </p>
                          <p className="text-sm text-gray-300">
                            <strong>Status:</strong> {withdrawal.status}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-gray-400">
                      No pending withdrawals.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* OTP Modal */}
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
