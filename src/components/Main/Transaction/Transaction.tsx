"use client";

import React, { useEffect, useState } from "react";
import { useTransaction } from "@/hooks/useTransaction";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";
import FilterSection from "./FilterSection";
import TransactionsSection from "./TransactionsSection";
import PurchasesSection from "./PurchasesSection";

export default function Transaction() {
  const { transactions, purchases, loading, error } = useTransaction();
  const [selectedType, setSelectedType] = useState<string>("deposit");
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    transactionsTitle: "트랜잭션",
    loadingMessage: "Loading...",
    errorMessage: "Error occurred",
    noDataMessage: "No Data Available",
  });

  // 번역된 텍스트 가져오기
  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("트랜잭션", language),
        translateText("Loading...", language),
        translateText("Error occurred", language),
        translateText("No Data Available", language),
      ]);

      setTranslatedTexts({
        transactionsTitle: translations[0],
        loadingMessage: translations[1],
        errorMessage: translations[2],
        noDataMessage: translations[3],
      });
    };

    fetchTranslations();
  }, [language]);

  // 필터링된 트랜잭션
  const filteredTransactions = transactions?.filter(
    (t) => t.type === selectedType
  );

  // `package_purchase` 항목에만 표시되는 PurchaseRecord
  const filteredPurchases =
    selectedType === "package_purchase" ? purchases : [];

  return (
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow pt-10">
        <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
          <h1 className="text-4xl font-bold text-center text-cyan-400 mb-8 tracking-wide">
            {translatedTexts.transactionsTitle}
          </h1>

          {loading ? (
            <div className="text-center text-gray-400">
              {translatedTexts.loadingMessage}
            </div>
          ) : error ? (
            <div className="text-center bg-red-500 text-white py-2 px-4 rounded">
              {translatedTexts.errorMessage}
            </div>
          ) : (
            <div className="space-y-8">
              <FilterSection
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
              <TransactionsSection transactions={filteredTransactions || []} />
              <PurchasesSection purchases={filteredPurchases || []} />
              {!filteredTransactions?.length && !filteredPurchases?.length && (
                <div className="text-center text-gray-500">
                  {translatedTexts.noDataMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
