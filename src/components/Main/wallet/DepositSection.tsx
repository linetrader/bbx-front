// components/DepositSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi"; // React Icons에서 복사 아이콘 가져오기
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

export default function DepositSection({
  error,
  loading,
  walletData,
  miningData,
  createWallet,
}: DepositSectionProps) {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    title: "입금 지갑",
    walletNotFound: "지갑을 찾을 수 없습니다. 지갑을 생성하세요.",
    loading: "로딩 중...",
    walletAddress: "지갑 주소:",
    usdtBalance: "USDT 수량:",
    dogeBalance: "DOGE 수량:",
    btcBalance: "BTC 수량:",
    copied: "지갑 주소가 클립보드에 복사되었습니다!",
    copyFailed: "지갑 주소 복사에 실패했습니다. 다시 시도하세요.",
    createWallet: "지갑 생성",
    creatingWallet: "지갑 생성 중...",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const keys = [
        { key: "title", text: "입금 지갑" },
        {
          key: "walletNotFound",
          text: "지갑을 찾을 수 없습니다. 지갑을 생성하세요.",
        },
        { key: "loading", text: "로딩 중..." },
        { key: "walletAddress", text: "지갑 주소:" },
        { key: "usdtBalance", text: "USDT 수량:" },
        { key: "dogeBalance", text: "DOGE 수량:" },
        { key: "btcBalance", text: "BTC 수량:" },
        { key: "copied", text: "지갑 주소가 클립보드에 복사되었습니다!" },
        {
          key: "copyFailed",
          text: "지갑 주소 복사에 실패했습니다. 다시 시도하세요.",
        },
        { key: "createWallet", text: "지갑 생성" },
        { key: "creatingWallet", text: "지갑 생성 중..." },
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

    if (balanceData && balanceData.miningBalance) {
      // 소수점 6자리로 변환
      return parseFloat(balanceData.miningBalance).toFixed(6);
    }

    return "0.000000";
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
