"use client";

import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { Transaction } from "../../../types/Common";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

interface TransactionsSectionProps {
  transactions: Transaction[] | undefined;
  miningLogs:
    | { endTime: Date; profit: number; packageType: string }[]
    | undefined;
  selectedType: string;
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  transactions = [],
  miningLogs = [],
  selectedType,
}) => {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    filteredTransactions: "트랜잭션 내역",
    type: "유형",
    amount: "수량",
    token: "토큰",
    date: "날짜",
    transactionHash: "트랜잭션 해시",
    copySuccess: "트랜잭션 해시가 클립보드에 복사되었습니다!",
    copyError: "트랜잭션 해시 복사에 실패했습니다. 다시 시도해주세요.",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const keys = [
        { key: "filteredTransactions", text: "트랜잭션 내역" },
        { key: "type", text: "유형" },
        { key: "amount", text: "수량" },
        { key: "token", text: "토큰" },
        { key: "date", text: "날짜" },
        { key: "transactionHash", text: "트랜잭션 해시" },
        {
          key: "copySuccess",
          text: "트랜잭션 해시가 클립보드에 복사되었습니다!",
        },
        {
          key: "copyError",
          text: "트랜잭션 해시 복사에 실패했습니다. 다시 시도해주세요.",
        },
      ];

      const translations = await Promise.all(
        keys.map((item) => fetchTranslation(item.text, language))
      );

      const updatedTranslations = keys.reduce(
        (acc, item, index) => {
          acc[item.key as keyof typeof translatedTexts] = translations[index];
          return acc;
        },
        { ...translatedTexts }
      );

      setTranslatedTexts(updatedTranslations);
    };

    fetchTranslations();
  }, [language]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(translatedTexts.copySuccess);
    } catch (err) {
      alert(translatedTexts.copyError);
    }
  };

  const getSectionTitle = () => {
    switch (selectedType) {
      case "minings":
        return "채굴내역";
      case "deposit":
        return "입금내역";
      case "withdrawal":
        return "출금내역";
      case "package_purchase":
        return "패키지 구매내역";
      case "referral_earning":
        return "추천 수익내역";
      default:
        return translatedTexts.filteredTransactions;
    }
  };

  if (selectedType === "minings" && miningLogs.length === 0) return null;
  if (selectedType !== "minings" && transactions.length === 0) return null;

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4">
        {getSectionTitle()}
      </h3>
      <div className="space-y-4">
        {selectedType === "minings"
          ? miningLogs.map((log, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900 rounded-lg border border-cyan-500"
              >
                <p className="text-lg text-gray-300">
                  <span className="font-bold text-cyan-400">패키지 유형:</span>{" "}
                  {log.packageType}
                </p>
                <p className="text-lg text-gray-300">
                  <span className="font-bold text-cyan-400">수익:</span>{" "}
                  {log.profit.toFixed(6)}
                </p>
                <p className="text-lg text-gray-300">
                  <span className="font-bold text-cyan-400">날짜:</span>{" "}
                  {new Date(log.endTime).toISOString().split("T")[0]}
                </p>
              </div>
            ))
          : transactions.map((transaction, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900 rounded-lg border border-cyan-500"
              >
                <p className="text-lg text-gray-300">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.type}:
                  </span>{" "}
                  {transaction.type}
                </p>
                <p className="text-lg text-gray-300">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.amount}:
                  </span>{" "}
                  {transaction.amount}
                </p>
                <p className="text-lg text-gray-300">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.token}:
                  </span>{" "}
                  {transaction.token}
                </p>
                <p className="text-lg text-gray-300">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.date}:
                  </span>{" "}
                  {new Date(
                    parseInt(transaction.createdAt, 10)
                  ).toLocaleString()}
                </p>
                <p className="text-lg text-gray-300 flex items-center gap-2">
                  <span className="font-bold text-cyan-400">
                    {translatedTexts.transactionHash}:
                  </span>{" "}
                  <span className="break-all">
                    {transaction.transactionHash.slice(0, 10)}...
                  </span>
                  <button
                    onClick={() => handleCopy(transaction.transactionHash)}
                    className="p-1 rounded-full bg-gray-700 hover:bg-cyan-500 text-white transition"
                  >
                    <FiCopy size={16} />
                  </button>
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default TransactionsSection;
