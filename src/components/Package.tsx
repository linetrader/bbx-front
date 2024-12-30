"use client";

import React from "react";
import { usePackage } from "../hooks/usePackage";

export default function Package() {
  const {
    packages,
    quantities,
    usdtBalance,
    purchaseRecords,
    loading,
    error,
    setQuantities,
    handlePurchase,
  } = usePackage();

  const inputStyles =
    "w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800 text-white placeholder-gray-500";
  const buttonStyles =
    "px-4 py-2 rounded font-bold transition-colors bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <main className="flex-grow pt-10">
        <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
          {/* Package Buy Section */}
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            Package Buy
          </h2>
          <h3 className="text-xl font-semibold text-gray-100 mb-6 text-center">
            My USDT Balance:{" "}
            <span className="text-cyan-400">{usdtBalance} USDT</span>
          </h3>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : error && error !== "Wallet not found." ? (
            <div className="bg-red-600/70 text-white border border-red-500 px-4 py-3 rounded mb-6 text-center">
              {error}
            </div>
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className="mb-6 p-4 border rounded border-cyan-500 bg-gray-800"
              >
                <h3 className="text-xl font-bold text-cyan-400 mb-4">
                  {pkg.name} ({pkg.price} USDT)
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={quantities[pkg.id]}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [pkg.id]: Number(e.target.value),
                      })
                    }
                    placeholder="Enter quantity"
                    className={inputStyles}
                  />
                  <button
                    className={buttonStyles}
                    onClick={() => handlePurchase(pkg.id)}
                  >
                    BUY
                  </button>
                </div>
              </div>
            ))
          )}

          {/* My Purchases Section */}
          <h2 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            My Purchases
          </h2>
          <div className="p-4 border rounded border-cyan-500 bg-gray-800">
            {error === "Wallet not found." && (
              <div className="bg-yellow-100 text-yellow-700 border border-yellow-600 px-4 py-3 rounded mb-4">
                Wallet not found. Please create a wallet.
              </div>
            )}
            {purchaseRecords.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-300">
                {purchaseRecords.map((record) => (
                  <li key={record.packageName} className="mb-2">
                    {record.packageName} - {record.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400">No purchases yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
