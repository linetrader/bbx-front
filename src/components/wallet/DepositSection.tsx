// components/DepositSection.tsx
"use client";

import React from "react";
import { FiCopy } from "react-icons/fi"; // React Icons에서 복사 아이콘 가져오기

interface DepositSectionProps {
  error: string | null;
  loading: boolean;
  walletData: any;
  createWallet: () => void;
}

export default function DepositSection({
  error,
  loading,
  walletData,
  createWallet,
}: DepositSectionProps) {
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Wallet address copied to clipboard!");
    } catch (err) {
      alert("Failed to copy wallet address. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        Deposit Wallet
      </h1>
      {error && (
        <div
          className={`px-4 py-3 rounded mb-4 text-sm border ${
            error === "Wallet not found."
              ? "bg-yellow-100 text-yellow-700 border-yellow-600"
              : "bg-red-100 text-red-700 border-red-400"
          }`}
        >
          {error === "Wallet not found."
            ? "Wallet not found. Please create a wallet."
            : error}
        </div>
      )}
      {loading ? (
        <div className="text-center text-gray-400 font-medium text-sm">
          Loading...
        </div>
      ) : walletData ? (
        <div className="text-left">
          <div className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-cyan-400 font-bold">Wallet Address:</p>
                <p className="font-mono break-all text-gray-300">
                  {walletData.address}
                </p>
              </div>
              <button
                onClick={() => handleCopy(walletData.address)}
                className="ml-4 p-2 rounded-full bg-gray-700 hover:bg-cyan-500 text-white transition"
              >
                <FiCopy size={20} /> {/* 복사 아이콘 추가 */}
              </button>
            </div>
            <div className="mb-4">
              <p className="text-cyan-400 font-bold">USDT Balance:</p>
              <p className="text-gray-300">{walletData.usdtBalance}</p>
            </div>
            <div className="mb-4">
              <p className="text-cyan-400 font-bold">DOGE Balance:</p>
              <p className="text-gray-300">{walletData.dogeBalance}</p>
            </div>
            <div className="mb-4">
              <p className="text-cyan-400 font-bold">BTC Balance:</p>
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
              : "bg-cyan-500 hover:bg-cyan-400"
          }`}
        >
          {loading ? "Creating Wallet..." : "Create Wallet"}
        </button>
      )}
    </div>
  );
}
