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

  return (
    <div
      className="overflow-y-auto"
      style={{
        height: "calc(100vh - 200px)",
        paddingBottom: "1rem",
        scrollbarWidth: "none", // For Firefox
        msOverflowStyle: "none", // For IE and Edge
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300">
        <main className="max-w-4xl mx-auto px-4 py-8 pt-0">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            {/* Package Buy Section */}
            <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6">
              Package Buy
            </h2>
            <h3 className="text-xl font-semibold text-gray-100 mb-4 text-center">
              My USDT Balance :{" "}
              <span className="text-gray-100">{usdtBalance} USDT</span>
            </h3>

            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : error && error !== "Wallet not found." ? (
              <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
                {error}
              </div>
            ) : (
              packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="mb-6 p-4 border rounded border-gray-700 bg-gray-800"
                >
                  <h3 className="text-xl font-bold text-gray-100 mb-2">
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
                      className="w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-gray-800 text-gray-300 placeholder-gray-400"
                    />
                    <button
                      className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold"
                      onClick={() => handlePurchase(pkg.id)}
                    >
                      BUY
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* My Purchases Section */}
            <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6">
              My Purchases
            </h2>
            <div className="mb-4 p-4 border rounded border-gray-700 bg-gray-800">
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
                <p className="text-gray-500">No purchases yet.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
