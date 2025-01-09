"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

interface PendingPurchase {
  packageName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

interface Props {
  pendingPurchases: PendingPurchase[] | null;
  loading: boolean;
  error: string | null;
}

export default function PendingPurchasesSection({
  pendingPurchases,
  loading,
  error,
}: Props) {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    pendingPurchases: "대기 중인 구매",
    loading: "대기 중인 구매를 로드하는 중...",
    noPendingPurchases: "대기 중인 구매 내역이 없습니다.",
    quantity: "수량",
    totalPrice: "총 가격",
    createdAt: "생성일",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "pendingPurchases", text: "대기 중인 구매" },
          { key: "loading", text: "대기 중인 구매를 로드하는 중..." },
          {
            key: "noPendingPurchases",
            text: "대기 중인 구매 내역이 없습니다.",
          },
          { key: "quantity", text: "수량" },
          { key: "totalPrice", text: "총 가격" },
          { key: "createdAt", text: "생성일" },
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
        console.error("[ERROR] 번역 가져오기 실패:", error);
      }
    };

    fetchTranslations();
  }, [language]);

  return (
    <div className="p-4 border rounded border-cyan-500 bg-gray-800">
      <h3 className="text-lg font-bold text-cyan-500 mb-4">
        {translatedTexts.pendingPurchases}
      </h3>

      {loading && <p className="text-gray-400">{translatedTexts.loading}</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && (!pendingPurchases || pendingPurchases.length === 0) && (
        <p className="text-gray-400">{translatedTexts.noPendingPurchases}</p>
      )}

      {!loading && pendingPurchases && pendingPurchases.length > 0 && (
        <div className="p-4 border rounded border-cyan-500 bg-gray-800">
          {pendingPurchases.map((purchase, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
            >
              <h4 className="text-white font-bold mb-2">
                {purchase.packageName}
              </h4>
              <p className="text-gray-400">
                <span className="font-bold text-white">
                  {translatedTexts.quantity}:
                </span>{" "}
                {purchase.quantity}
              </p>
              <p className="text-gray-400">
                <span className="font-bold text-white">
                  {translatedTexts.totalPrice}:
                </span>{" "}
                ${purchase.totalPrice}
              </p>
              <p className="text-gray-400">
                <span className="font-bold text-white">
                  {translatedTexts.createdAt}:
                </span>{" "}
                {new Date(Number(purchase.createdAt)).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
