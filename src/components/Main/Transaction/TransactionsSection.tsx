"use client";

import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { Transaction } from "../../../hooks/types/common";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

interface TransactionsSectionProps {
  transactions: Transaction[] | undefined;
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  transactions = [],
}) => {
  const { language } = useTranslationContext();
  const [translatedTexts, setTranslatedTexts] = useState({
    filteredTransactions: "입출금 기록",
    type: "Type",
    amount: "수량",
    token: "Token",
    date: "Date",
    transactionHash: "Transaction Hash",
    copySuccess: "Transaction hash copied to clipboard!",
    copyError: "Failed to copy transaction hash. Please try again.",
  });

  // 번역된 텍스트 가져오기
  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("입출금 기록", language),
        translateText("Type", language),
        translateText("수량", language),
        translateText("Token", language),
        translateText("Date", language),
        translateText("Transaction Hash", language),
        translateText("Transaction hash copied to clipboard!", language),
        translateText(
          "Failed to copy transaction hash. Please try again.",
          language
        ),
      ]);

      setTranslatedTexts({
        filteredTransactions: translations[0],
        type: translations[1],
        amount: translations[2],
        token: translations[3],
        date: translations[4],
        transactionHash: translations[5],
        copySuccess: translations[6],
        copyError: translations[7],
      });
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
