// src/components/Main/Transaction/TransactionsSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { Transaction } from "../../../hooks/types/common";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

interface TransactionsSectionProps {
  transactions: Transaction[] | undefined;
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  transactions = [],
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
      try {
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
      } catch (error) {
        console.error("[ERROR] Failed to fetch translations:", error);
      }
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

  if (transactions.length === 0) return null; // 빈 배열이면 렌더링하지 않음

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4">
        {translatedTexts.filteredTransactions}
      </h3>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
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
              {new Date(parseInt(transaction.createdAt, 10)).toLocaleString()}
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
