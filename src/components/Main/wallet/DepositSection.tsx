// components/DepositSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi"; // React Icons에서 복사 아이콘 가져오기
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

interface DepositSectionProps {
  error: string | null;
  loading: boolean;
  walletData: any;
  miningData: any;
  createWallet: () => void;
}

export default function DepositSection({
  error,
  loading,
  walletData,
  miningData,
  createWallet,
}: DepositSectionProps) {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    title: "Deposit Wallet",
    walletNotFound: "Wallet not found. Please create a wallet.",
    loading: "Loading...",
    walletAddress: "Wallet Address:",
    usdtBalance: "USDT Balance:",
    dogeBalance: "DOGE Balance:",
    btcBalance: "BTC Balance:",
    copied: "Wallet address copied to clipboard!",
    copyFailed: "Failed to copy wallet address. Please try again.",
    createWallet: "Create Wallet",
    creatingWallet: "Creating Wallet...",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("Deposit Wallet", language),
        translateText("Wallet not found. Please create a wallet.", language),
        translateText("Loading...", language),
        translateText("Wallet Address:", language),
        translateText("USDT Balance:", language),
        translateText("DOGE Balance:", language),
        translateText("BTC Balance:", language),
        translateText("Wallet address copied to clipboard!", language),
        translateText(
          "Failed to copy wallet address. Please try again.",
          language
        ),
        translateText("Create Wallet", language),
        translateText("Creating Wallet...", language),
      ]);

      setTranslatedTexts({
        title: translations[0],
        walletNotFound: translations[1],
        loading: translations[2],
        walletAddress: translations[3],
        usdtBalance: translations[4],
        dogeBalance: translations[5],
        btcBalance: translations[6],
        copied: translations[7],
        copyFailed: translations[8],
        createWallet: translations[9],
        creatingWallet: translations[10],
      });
    };

    fetchTranslations();
  }, [language]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(translatedTexts.copied);
    } catch (err) {
      alert(translatedTexts.copyFailed);
    }
  };

  const getBalanceByType = (type: string) => {
    const balanceData = miningData.find(
      (data: any) => data.packageType === type
    );
    return balanceData ? balanceData.miningBalance : "0";
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        {translatedTexts.title}
      </h1>
      {walletData === null && (
        <div className="px-4 py-3 rounded mb-4 text-sm bg-yellow-100 text-yellow-700 border-yellow-600">
          {translatedTexts.walletNotFound}
        </div>
      )}
      {error && walletData !== null && (
        <div
          className={`px-4 py-3 rounded mb-4 text-sm border ${
            error === "Wallet not found."
              ? "bg-yellow-100 text-yellow-700 border-yellow-600"
              : "bg-red-100 text-red-700 border-red-400"
          }`}
        >
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center text-gray-400 font-medium text-sm">
          {translatedTexts.loading}
        </div>
      ) : walletData ? (
        <div className="text-left">
          <div className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-cyan-400 font-bold">
                  {translatedTexts.walletAddress}
                </p>
                <p className="font-mono break-all text-gray-300">
                  {walletData.address}
                </p>
              </div>
              <button
                onClick={() => handleCopy(walletData.address)}
                className="ml-4 p-2 rounded-full bg-gray-700 hover:bg-cyan-500 text-white transition"
              >
                <FiCopy size={20} /> {/* 복사 아이콘 추가 */}
              </button>
            </div>
            <div className="mb-4">
              <p className="text-cyan-400 font-bold">
                {translatedTexts.usdtBalance}
              </p>
              <p className="text-gray-300">{walletData.usdtBalance}</p>
            </div>
            <div className="mb-4">
              <p className="text-cyan-400 font-bold">
                {translatedTexts.dogeBalance}
              </p>
              <p className="text-gray-300">{getBalanceByType("DOGE")}</p>
            </div>
            <div className="mb-4">
              <p className="text-cyan-400 font-bold">
                {translatedTexts.btcBalance}
              </p>
              <p className="text-gray-300">{getBalanceByType("BTC")}</p>
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
              : "bg-cyan-500 hover:bg-cyan-400"
          }`}
        >
          {loading
            ? translatedTexts.creatingWallet
            : translatedTexts.createWallet}
        </button>
      )}
    </div>
  );
}
