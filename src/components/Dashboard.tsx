// components/Dashboard.tsx
"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { miningData, referralRewards, loading, error } = useDashboard();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <main className="flex-grow pt-10">
        <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8 tracking-wide">
            Dashboard
          </h2>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center bg-red-500 text-white py-2 px-4 rounded">
              Error: {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Mining Data Section */}
              <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  Mining Data
                </h3>
                <p className="text-lg text-gray-300 mb-2">
                  <span className="font-bold text-cyan-400">BTC Mined:</span>{" "}
                  {miningData?.btcMined ?? 0}
                </p>
                <p className="text-lg text-gray-300">
                  <span className="font-bold text-cyan-400">DOGE Mined:</span>{" "}
                  {miningData?.dogeMined ?? 0}
                </p>
              </div>

              {/* Referral Rewards Section */}
              <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  Referral Rewards
                </h3>
                <p className="text-lg text-gray-300 mb-2">
                  <span className="font-bold text-cyan-400">
                    BTC Referral Rewards:
                  </span>{" "}
                  {referralRewards?.btcReferral ?? 0}
                </p>
                <p className="text-lg text-gray-300 mb-2">
                  <span className="font-bold text-cyan-400">
                    DOGE Referral Rewards:
                  </span>{" "}
                  {referralRewards?.dogeReferral ?? 0}
                </p>
                <p className="text-lg text-gray-300">
                  <span className="font-bold text-cyan-400">
                    USDT Referral Rewards:
                  </span>{" "}
                  {referralRewards?.usdtReferral ?? 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
