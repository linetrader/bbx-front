// components/Dashboard.tsx

"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useTranslation } from "next-i18next"; // useTranslation 훅 임포트

export default function Dashboard() {
  const { miningData, referralRewards, loading, error } = useDashboard();
  const { t } = useTranslation("dashboard"); // useTranslation 훅 사용하여 t 함수 얻기

  return (
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow pt-10">
        <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8 tracking-wide">
            {t("dashboard")}
          </h2>

          {loading ? (
            <div className="text-center text-gray-400">{t("loading")}...</div>
          ) : error ? (
            <div className="text-center bg-red-500 text-white py-2 px-4 rounded">
              {t("error")}: {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Mining Data Section */}
              <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  {t("miningProfit")}:
                </h3>
                {miningData?.map((data, index) => (
                  <p key={index} className="text-lg text-gray-300 mb-2">
                    <span className="font-bold text-cyan-400">
                      {data.packageType} {t("mined")}:
                    </span>{" "}
                    {data.miningBalance}
                  </p>
                ))}
              </div>

              {/* Referral Rewards Section */}
              <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  {t("referralRewards")}
                </h3>
                {referralRewards?.map((reward, index) => (
                  <p key={index} className="text-lg text-gray-300 mb-2">
                    <span className="font-bold text-cyan-400">
                      {reward.packageType} {t("referralBalance")}:
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
