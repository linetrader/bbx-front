// components/Transaction.tsx

"use client";

import React, { useState } from "react";
import { useTransaction } from "@/hooks/useTransaction";

export default function Transaction() {
  const {
    transactions,
    purchases,
    loading,
    error,
    fetchTransactionData,
    fetchPurchaseRecords,
  } = useTransaction();
  const [selectedType, setSelectedType] = useState<string>("deposit");

  // 필터링된 트랜잭션
  const filteredTransactions = transactions?.filter(
    (t) => t.type === selectedType
  );

  // PurchaseRecord는 'package_purchase' 항목에서만 표시
  const filteredPurchases =
    selectedType === "package_purchase" ? purchases : [];

  const transactionTypes = [
    { label: "Deposits", value: "deposit" },
    { label: "Withdrawals", value: "withdrawal" },
    { label: "Package Purchases", value: "package_purchase" },
    { label: "Referral Earnings", value: "referral_earning" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <main className="flex-grow pt-10">
        <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
          <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
            Transactions
          </h1>
          {error && (
            <div className="bg-red-600/70 text-white border border-red-500 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-cyan-400 mb-2">
                  Filter by Type
                </h2>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="overflow-y-auto max-h-[400px] scrollbar-hide">
                {filteredTransactions && filteredTransactions.length > 0 ? (
                  <div className="text-sm text-gray-300">
                    {filteredTransactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800"
                      >
                        <p className="mb-2">
                          <span className="font-bold text-cyan-400">Type:</span>{" "}
                          {transaction.type}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-cyan-400">
                            Amount:
                          </span>{" "}
                          {transaction.amount}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-cyan-400">
                            Token:
                          </span>{" "}
                          {transaction.token}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-cyan-400">Date:</span>{" "}
                          {new Date(
                            parseInt(transaction.createdAt, 10)
                          ).toLocaleString("en-US", {
                            timeZone: "UTC",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                          {" (UTC)"}
                        </p>
                        <p>
                          <span className="font-bold text-cyan-400">
                            Transaction Hash:
                          </span>{" "}
                          {transaction.transactionHash}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {filteredPurchases && filteredPurchases.length > 0 && (
                  <div className="text-sm text-gray-300">
                    {filteredPurchases.map((purchase, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800"
                      >
                        <p className="mb-2">
                          <span className="font-bold text-cyan-400">
                            Package Name:
                          </span>{" "}
                          {purchase.packageName}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-cyan-400">
                            Quantity:
                          </span>{" "}
                          {purchase.quantity}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-cyan-400">
                            Total Price:
                          </span>{" "}
                          {purchase.totalPrice}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold text-cyan-400">Date:</span>{" "}
                          {new Date(
                            parseInt(purchase.createdAt, 10)
                          ).toLocaleString("en-US", {
                            timeZone: "UTC",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                          {" (UTC)"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
