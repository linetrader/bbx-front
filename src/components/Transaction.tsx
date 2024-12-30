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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300 pt-3">
      <div className="flex justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-yellow-600 mb-6">
            Transactions
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-300 mb-2">
                  Filter by Type
                </h2>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-4 py-2 w-full"
                >
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="overflow-y-auto"
                style={{
                  height: "calc(100vh - 200px)",
                  paddingBottom: "1rem",
                  scrollbarWidth: "none", // For Firefox
                  msOverflowStyle: "none", // For IE and Edge
                }}
              >
                {filteredTransactions && filteredTransactions.length > 0 ? (
                  <div className="text-sm text-gray-300">
                    {filteredTransactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 border rounded border-gray-700 bg-gray-800"
                      >
                        <p className="mb-2">
                          <span className="font-bold">Type:</span>{" "}
                          {transaction.type}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold">Amount:</span>{" "}
                          {transaction.amount}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold">Token:</span>{" "}
                          {transaction.token}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold">Date:</span>{" "}
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
                          {" (UTC 기준)"}
                        </p>
                        <p>
                          <span className="font-bold">Transaction Hash:</span>{" "}
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
                        className="mb-4 p-4 border rounded border-gray-700 bg-gray-800"
                      >
                        <p className="mb-2">
                          <span className="font-bold">Package Name:</span>{" "}
                          {purchase.packageName}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold">Quantity:</span>{" "}
                          {purchase.quantity}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold">Total Price:</span>{" "}
                          {purchase.totalPrice}
                        </p>
                        <p className="mb-2">
                          <span className="font-bold">Date:</span>{" "}
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
                          {" (UTC 기준)"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
