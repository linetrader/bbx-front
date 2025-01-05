// src/components/MyPurchasesSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

interface MyPurchasesSectionProps {
  userPackages: any[];
  error: string | null;
}

export default function MyPurchasesSection({
  userPackages,
  error,
}: MyPurchasesSectionProps) {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    title: "내 패키지",
    walletError: "지갑을 찾을 수 없습니다. 지갑을 생성하세요.",
    noPurchases: "구매 내역이 없습니다.",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "title", text: "내 패키지" },
          {
            key: "walletError",
            text: "지갑을 찾을 수 없습니다. 지갑을 생성하세요.",
          },
          { key: "noPurchases", text: "구매 내역이 없습니다." },
        ];

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

  return (
    <div>
      <h2 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        {translatedTexts.title}
      </h2>
      <div className="p-4 border rounded border-cyan-500 bg-gray-800">
        {error === "Wallet not found." && (
          <div className="bg-yellow-100 text-yellow-700 border border-yellow-600 px-4 py-3 rounded mb-4">
            {translatedTexts.walletError}
          </div>
        )}
        {userPackages.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-300">
            {userPackages.map((record) => (
              <li key={record.packageType} className="mb-2">
                {record.packageType} mining - {record.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">
            {translatedTexts.noPurchases}
          </p>
        )}
      </div>
    </div>
  );
}
