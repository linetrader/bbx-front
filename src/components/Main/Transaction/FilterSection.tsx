"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

interface FilterSectionProps {
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
}

const defaultTransactionTypes = [
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
    deposits: "입금",
    withdrawals: "출금",
    packagePurchases: "Package Purchases",
    referralEarnings: "Referral Earnings",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const [deposits, withdrawals, packagePurchases, referralEarnings] =
        await Promise.all([
          translateText("입금", language),
          translateText("출금", language),
          translateText("Package Purchases", language),
          translateText("Referral Earnings", language),
        ]);

      setTranslatedTypes({
        deposits,
        withdrawals,
        packagePurchases,
        referralEarnings,
      });
    };

    fetchTranslations();
  }, [language]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4">
        Filter Transactions
      </h3>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
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
