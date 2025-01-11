// components/Dashboard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

export default function Dashboard() {
  const { miningData, referralRewards, loading, error, fetchMiningData } =
    useDashboard();
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    dashboardTitle: "대시보드",
    loadingText: "로딩 중...",
    errorText: "오류 발생",
    miningProfitTitle: "채굴 수익",
    referralRewardsTitle: "추천 보상",
    tradingChartTitle: "DOGE 코인 차트", // 차트 섹션 제목 추가
    priceText: "가격",
    currencyUnit: "원",
    viewChartButton: "차트 보기",
  });

  const [showChart, setShowChart] = useState(false); // 차트 표시 여부 상태

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "dashboardTitle", text: "대시보드" },
          { key: "loadingText", text: "로딩 중..." },
          { key: "errorText", text: "오류 발생" },
          { key: "miningProfitTitle", text: "채굴 수익" },
          { key: "referralRewardsTitle", text: "추천 보상" },
          { key: "tradingChartTitle", text: "DOGE 코인 차트" },
          { key: "priceText", text: "가격" },
          { key: "currencyUnit", text: "원" },
          { key: "viewChartButton", text: "차트 보기" },
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
    fetchMiningData(language);
  }, [language]);

  useEffect(() => {
    if (showChart) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;

      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            container_id: "tradingview_doge_chart",
            autosize: true,
            symbol: "BINANCE:DOGEUSDT",
            interval: "30",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            allow_symbol_change: true,
            studies: ["RSI@tv-basicstudies"],
          });
        }
      };

      document.body.appendChild(script);
    }
  }, [showChart]); // showChart가 true일 때 차트 로드

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
                  <div
                    key={index}
                    className="mb-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-lg text-gray-300">
                        <span className="font-bold text-cyan-400">
                          {data.packageType} mined:
                        </span>{" "}
                        {data.miningBalance}
                      </p>
                      <p className="text-lg text-gray-300">
                        {translatedTexts.priceText}: {data.totalPrice}{" "}
                        {translatedTexts.currencyUnit}
                      </p>
                    </div>
                    {data.packageType === "DOGE" && (
                      <button
                        onClick={() => setShowChart(true)} // 차트 섹션 표시
                        className="text-sm px-3 py-1 bg-cyan-500 text-white rounded hover:bg-cyan-600"
                      >
                        {translatedTexts.viewChartButton}
                      </button>
                    )}
                  </div>
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

              {/* Trading Chart Section */}
              {showChart && (
                <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    {translatedTexts.tradingChartTitle}
                  </h3>
                  <div
                    id="tradingview_doge_chart"
                    style={{ width: "100%", height: "500px" }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
