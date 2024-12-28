// components/Package.tsx

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="flex-grow flex items-start justify-center pt-12">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* My Purchases Section */}
          <h2 className="text-4xl font-bold text-blue-400 mb-4">
            My Purchases
          </h2>
          <div className="bg-gray-800 p-4 rounded mb-6">
            {purchaseRecords.length > 0 ? (
              <ul className="list-disc pl-5">
                {purchaseRecords.map((record) => (
                  <li key={record.packageName}>
                    {record.packageName} - {record.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No purchases yet.</p>
            )}
          </div>

          {/* Package Buy Section */}
          <h2 className="text-4xl font-bold text-blue-400 mb-4 pt-20">
            Package Buy
          </h2>
          <h3 className="text-2xl text-white mb-4">
            My USDT: {usdtBalance} USDT
          </h3>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            packages.map((pkg) => (
              <div className="my-6" key={pkg.id}>
                <h3 className="text-xl text-white">
                  {pkg.name} ({pkg.price} USDT)
                </h3>
                <input
                  type="number"
                  value={quantities[pkg.id]}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [pkg.id]: Number(e.target.value),
                    })
                  }
                  className="border p-2 mt-2 text-black"
                />
                <button
                  className="bg-blue-500 text-black p-2 ml-2"
                  onClick={() => handlePurchase(pkg.id)}
                >
                  BUY
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
