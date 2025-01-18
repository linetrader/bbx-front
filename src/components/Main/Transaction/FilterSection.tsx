// src/components/Main/Transaction/FilterSection.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

interface FilterSectionProps {
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
}

const defaultTransactionTypes = [
  { label: "Minings", value: "minings" },
  { label: "Deposits", value: "deposit" },
  { label: "Withdrawals", value: "withdrawal" },
  { label: "Package Purchases", value: "package_purchase" },
  { label: "Referral Earnings", value: "referral_earning" },
];

const FilterSection: React.FC<FilterSectionProps> = ({
  selectedType,
  setSelectedType,
}) => {
  const { language } = useTranslationContext();

  const [translatedTypes, setTranslatedTypes] = useState({
    filterTransactions: "거래 필터",
    minings: "채굴내역",
    deposits: "입금내역",
    withdrawals: "출금내역",
    packagePurchases: "패키지 구매내역",
    referralEarnings: "추천 수익",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const keys = [
        { key: "filterTransactions", text: "거래 필터" },
        { key: "minings", text: "채굴내역" },
        { key: "deposits", text: "입금내역" },
        { key: "withdrawals", text: "출금내역" },
        { key: "packagePurchases", text: "패키지 구매내역" },
        { key: "referralEarnings", text: "추천 수익내역" },
      ];

      try {
        const translations = await Promise.all(
          keys.map((item) => fetchTranslation(item.text, language))
        );

        const updatedTypes = keys.reduce(
          (acc, item, index) => {
            acc[item.key as keyof typeof translatedTypes] = translations[index];
            return acc;
          },
          { ...translatedTypes }
        );

        setTranslatedTypes(updatedTypes);
      } catch (error) {
        console.error("[ERROR] Failed to fetch translations:", error);
      }
    };

    fetchTranslations();
  }, [language]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4">
        {translatedTypes.filterTransactions}
      </h3>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        <option value="minings">{translatedTypes.minings}</option>
        <option value="deposit">{translatedTypes.deposits}</option>
        <option value="withdrawal">{translatedTypes.withdrawals}</option>
        <option value="package_purchase">
          {translatedTypes.packagePurchases}
        </option>
        <option value="referral_earning">
          {translatedTypes.referralEarnings}
        </option>
      </select>
    </div>
  );
};

export default FilterSection;
