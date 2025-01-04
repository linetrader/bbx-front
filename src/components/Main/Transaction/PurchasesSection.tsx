"use client";

import React, { useEffect, useState } from "react";
import { PurchaseRecord } from "../../../hooks/types/common";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

interface PurchasesSectionProps {
  purchases: PurchaseRecord[] | null;
}

const PurchasesSection: React.FC<PurchasesSectionProps> = ({
  purchases = [],
}) => {
  const { language } = useTranslationContext();
  const [translatedTexts, setTranslatedTexts] = useState({
    packagePurchases: "Package Purchases",
    packageName: "Package Name",
    quantity: "Quantity",
    totalPrice: "Total Price",
    date: "Date",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("Package Purchases", language),
        translateText("Package Name", language),
        translateText("Quantity", language),
        translateText("Total Price", language),
        translateText("Date", language),
      ]);

      setTranslatedTexts({
        packagePurchases: translations[0],
        packageName: translations[1],
        quantity: translations[2],
        totalPrice: translations[3],
        date: translations[4],
      });
    };

    fetchTranslations();
  }, [language]);

  if (purchases === null || purchases.length === 0) return null;

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
