// components/Wallet.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";
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
    pendingWithdrawals,
    loading,
    error,
    fetchDepositWallet,
    fetchMiningData,
    fetchPendingWithdrawals,
    createWallet,
    handleConfirmWithdraw,
    saveWithdrawAddress,
  } = useWallet();

  const { language } = useTranslationContext();

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DEPOSIT);

  const [translatedTexts, setTranslatedTexts] = useState({
    deposit: "입금",
    withdraw: "출금",
  });

  const handleSaveWithdrawAddress = async (address: string, otp: string) => {
    await saveWithdrawAddress(address, otp);
    return true;
  };

  useEffect(() => {
    const fetchTranslations = async () => {
      const keys = [
        { key: "deposit", text: "입금" },
        { key: "withdraw", text: "출금" },
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

  useEffect(() => {
    if (viewMode === ViewMode.DEPOSIT) {
      fetchDepositWallet();
      fetchMiningData();
    } else if (viewMode === ViewMode.WITHDRAW) {
      fetchDepositWallet();
      fetchMiningData();
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
              {translatedTexts.deposit}
            </button>
            <button
              onClick={() => setViewMode(ViewMode.WITHDRAW)}
              className={`px-4 py-2 rounded font-semibold transition-colors text-sm ${
                viewMode === ViewMode.WITHDRAW
                  ? "bg-cyan-500 text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {translatedTexts.withdraw}
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
              loading={loading}
              walletData={walletData}
              miningData={miningData}
              handleSaveWithdrawAddress={handleSaveWithdrawAddress}
              pendingWithdrawals={pendingWithdrawals}
              handleConfirmWithdraw={handleConfirmWithdraw}
            />
          )}
        </div>
      </main>
    </div>
  );
}
