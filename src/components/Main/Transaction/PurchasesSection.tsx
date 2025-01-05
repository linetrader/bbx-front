"use client";

import React, { useEffect, useState } from "react";
import { PurchaseRecord } from "../../../hooks/types/common";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

interface PurchasesSectionProps {
  purchases: PurchaseRecord[] | null;
}

const PurchasesSection: React.FC<PurchasesSectionProps> = ({
  purchases = [],
}) => {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    packagePurchases: "패키지 구매",
    packageName: "패키지 이름",
    quantity: "수량",
    totalPrice: "총 가격",
    date: "날짜",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const keys = [
        { key: "packagePurchases", text: "패키지 구매" },
        { key: "packageName", text: "패키지 이름" },
        { key: "quantity", text: "수량" },
        { key: "totalPrice", text: "총 가격" },
        { key: "date", text: "날짜" },
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

  if (!purchases || purchases.length === 0) return null;

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4">
        {translatedTexts.packagePurchases}
      </h3>
      <div className="space-y-4">
        {purchases.map((purchase, index) => (
          <div
            key={index}
            className="p-4 bg-gray-900 rounded-lg border border-cyan-500"
          >
            <p className="text-lg text-gray-300">
              <span className="font-bold text-cyan-400">
                {translatedTexts.packageName}:
              </span>{" "}
              {purchase.packageName}
            </p>
            <p className="text-lg text-gray-300">
              <span className="font-bold text-cyan-400">
                {translatedTexts.quantity}:
              </span>{" "}
              {purchase.quantity}
            </p>
            <p className="text-lg text-gray-300">
              <span className="font-bold text-cyan-400">
                {translatedTexts.totalPrice}:
              </span>{" "}
              {purchase.totalPrice}
            </p>
            <p className="text-lg text-gray-300">
              <span className="font-bold text-cyan-400">
                {translatedTexts.date}:
              </span>{" "}
              {new Date(parseInt(purchase.createdAt, 10)).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasesSection;
