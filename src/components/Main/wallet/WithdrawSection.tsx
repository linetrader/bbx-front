// components/WithdrawSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

type TokenType = "usdt" | "doge" | "btc";

interface WithdrawSectionProps {
  withdrawalAmounts: Record<TokenType, string>;
  handleInputChange: (token: TokenType, value: string) => void;
  handleWithdrawClick: (token: TokenType) => void;
  loading: boolean;
  pendingWithdrawals: Array<{
    currency: string;
    amount: string;
    status: string;
  }>;
}

export default function WithdrawSection({
  withdrawalAmounts,
  handleInputChange,
  handleWithdrawClick,
  loading,
  pendingWithdrawals,
}: WithdrawSectionProps) {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    withdrawWallet: "Withdraw Wallet",
    amountLabel: "Quantity",
    processing: "Processing...",
    withdraw: "출금",
    pendingWithdraws: "Withdraw Pending",
    noPendingWithdraws: "No pending withdrawals.",
    currency: "Currency",
    amount: "Amount",
    status: "Status",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("Withdraw Wallet", language),
        translateText("Quantity", language),
        translateText("Processing...", language),
        translateText("출금", language),
        translateText("Withdraw Pending", language),
        translateText("No pending withdrawals.", language),
        translateText("Currency", language),
        translateText("Amount", language),
        translateText("Status", language),
      ]);

      setTranslatedTexts({
        withdrawWallet: translations[0],
        amountLabel: translations[1],
        processing: translations[2],
        withdraw: translations[3],
        pendingWithdraws: translations[4],
        noPendingWithdraws: translations[5],
        currency: translations[6],
        amount: translations[7],
        status: translations[8],
      });
    };

    fetchTranslations();
  }, [language]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        {translatedTexts.withdrawWallet}
      </h1>
      <div className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800">
        {(["usdt", "doge", "btc"] as TokenType[]).map((token) => (
          <div key={token} className="mb-4">
            <label
              htmlFor={`${token}-withdraw`}
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              {token.toUpperCase()} {translatedTexts.amountLabel}
            </label>
            <div className="flex items-center gap-6">
              <input
                id={`${token}-withdraw`}
                type="number"
                step="0.000001"
                value={withdrawalAmounts[token]}
                onChange={(e) => handleInputChange(token, e.target.value)}
                placeholder={`Enter ${token.toUpperCase()} ${
                  translatedTexts.amountLabel
                }`}
                className="w-1/2 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800 text-white placeholder-gray-400"
              />
              <button
                onClick={() => handleWithdrawClick(token)}
                disabled={loading}
                className={`px-4 py-2 rounded font-semibold shadow-md transition-colors text-white text-sm ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-400"
                }`}
              >
                {loading
                  ? translatedTexts.processing
                  : translatedTexts.withdraw}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        {translatedTexts.pendingWithdraws}
      </h1>
      <div className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800">
        {pendingWithdrawals.length > 0 ? (
          <ul className="space-y-4">
            {pendingWithdrawals.map((withdrawal, index) => (
              <li key={index} className="p-4 bg-gray-700 rounded">
                <p className="text-sm text-gray-300">
                  <strong>{translatedTexts.currency}:</strong>{" "}
                  {withdrawal.currency}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>{translatedTexts.amount}:</strong> {withdrawal.amount}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>{translatedTexts.status}:</strong> {withdrawal.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">
            {translatedTexts.noPendingWithdraws}
          </p>
        )}
      </div>
    </div>
  );
}
