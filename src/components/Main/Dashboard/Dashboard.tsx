// components/Dashboard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

export default function Dashboard() {
  const { miningData, referralRewards, loading, error } = useDashboard();
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    dashboardTitle: "대시보드",
    loadingText: "로딩 중...",
    errorText: "오류 발생",
    miningProfitTitle: "채굴 수익",
    referralRewardsTitle: "추천 보상",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "dashboardTitle", text: "대시보드" },
          { key: "loadingText", text: "로딩 중..." },
          { key: "errorText", text: "오류 발생" },
          { key: "miningProfitTitle", text: "채굴 수익" },
          { key: "referralRewardsTitle", text: "추천 보상" },
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

  return (
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow pt-10">
        <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8 tracking-wide">
            {translatedTexts.dashboardTitle}
          </h2>

          {loading ? (
            <div className="text-center text-gray-400">
              {translatedTexts.loadingText}
            </div>
          ) : error ? (
            <div className="text-center bg-red-500 text-white py-2 px-4 rounded">
              {translatedTexts.errorText}: {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Mining Data Section */}
              <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  {translatedTexts.miningProfitTitle}
                </h3>
                {miningData?.map((data, index) => (
                  <p key={index} className="text-lg text-gray-300 mb-2">
                    <span className="font-bold text-cyan-400">
                      {data.packageType} mined:
                    </span>{" "}
                    {data.miningBalance}
                  </p>
                ))}
              </div>

              {/* Referral Rewards Section */}
              <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  {translatedTexts.referralRewardsTitle}
                </h3>
                {referralRewards?.map((reward, index) => (
                  <p key={index} className="text-lg text-gray-300 mb-2">
                    <span className="font-bold text-cyan-400">
                      {reward.packageType} 추천 보상:
                    </span>{" "}
                    {reward.referralBalance}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
