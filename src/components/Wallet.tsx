// components/Wallet.tsx

"use client";

import React from "react";
import { useWallet } from "@/hooks/useWallet";

export default function Wallet() {
  const { walletData, loading, error, fetchWallet, createWallet } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white pt-24">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
            Wallet
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-400 font-medium text-sm">
              Loading...
            </div>
          ) : walletData ? (
            <div className="text-left">
              <div className="mb-4 p-4 border rounded border-gray-700 bg-gray-800">
                <div className="mb-4">
                  <p className="text-blue-400 font-bold">Wallet Address:</p>
                  <p className="font-mono break-all text-gray-300">
                    {walletData.address}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-blue-400 font-bold">USDT Balance:</p>
                  <p className="text-gray-300">{walletData.usdtBalance}</p>
                </div>
                <div className="mb-4">
                  <p className="text-blue-400 font-bold">DOGE Balance:</p>
                  <p className="text-gray-300">{walletData.dogeBalance}</p>
                </div>
                <div className="mb-4">
                  <p className="text-blue-400 font-bold">BTC Balance:</p>
                  <p className="text-gray-300">{walletData.btcBalance}</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={createWallet}
              disabled={loading}
              className={`w-full py-2 mt-4 rounded font-semibold shadow-md transition-colors text-white text-sm ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-400"
              }`}
            >
              {loading ? "Creating Wallet..." : "Create Wallet"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
