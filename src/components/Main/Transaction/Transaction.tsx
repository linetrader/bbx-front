// components/Transaction.tsx

"use client";

import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { useTransaction } from "@/hooks/useTransaction";

export default function Transaction() {
  const { transactions, purchases, loading, error } = useTransaction();
  const [selectedType, setSelectedType] = useState<string>("deposit");

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Transaction hash copied to clipboard!");
    } catch (err) {
      alert("Failed to copy transaction hash. Please try again.");
    }
  };

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
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow pt-10">
        <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
          <h1 className="text-4xl font-bold text-center text-cyan-400 mb-8 tracking-wide">
            Transactions
          </h1>

          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center bg-red-500 text-white py-2 px-4 rounded">
              Error: {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Filter Section */}
              <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  Filter Transactions
                </h3>
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

              {/* Transactions Section */}
              {filteredTransactions && filteredTransactions.length > 0 && (
                <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    Filtered Transactions
                  </h3>
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-900 rounded-lg border border-cyan-500"
                      >
                        <p className="text-lg text-gray-300">
                          <span className="font-bold text-cyan-400">Type:</span>{" "}
                          {transaction.type}
                        </p>
                        <p className="text-lg text-gray-300">
                          <span className="font-bold text-cyan-400">
                            Amount:
                          </span>{" "}
                          {transaction.amount}
                        </p>
                        <p className="text-lg text-gray-300">
                          <span className="font-bold text-cyan-400">
                            Token:
                          </span>{" "}
                          {transaction.token}
                        </p>
                        <p className="text-lg text-gray-300">
                          <span className="font-bold text-cyan-400">Date:</span>{" "}
                          {new Date(
                            parseInt(transaction.createdAt, 10)
                          ).toLocaleString()}
                        </p>
                        <p className="text-lg text-gray-300 flex items-center gap-2">
                          <span className="font-bold text-cyan-400">
                            Transaction Hash:
                          </span>{" "}
                          <span className="break-all">
                            {transaction.transactionHash.slice(0, 10)}...
                          </span>
                          <button
                            onClick={() =>
                              handleCopy(transaction.transactionHash)
                            }
                            className="p-1 rounded-full bg-gray-700 hover:bg-cyan-500 text-white transition"
                          >
                            <FiCopy size={16} />
                          </button>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Purchases Section */}
              {filteredPurchases && filteredPurchases.length > 0 && (
                <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                    Package Purchases
                  </h3>
                  <div className="space-y-4">
                    {filteredPurchases.map((purchase, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-900 rounded-lg border border-cyan-500"
                      >
                        <p className="text-lg text-gray-300">
                          <span className="font-bold text-cyan-400">
                            Package Name:
                          </span>{" "}
                          {purchase.packageName}
                        </p>
                        <p className="text-lg text-gray-300">
                          <span className="font-bold text-cyan-400">
                            Quantity:
                          </span>{" "}
                          {purchase.quantity}
                        </p>
                        <p className="text-lg text-gray-300">
                          <span className="font-bold text-cyan-400">
                            Total Price:
                          </span>{" "}
                          {purchase.totalPrice}
                        </p>
                        <p className="text-lg text-gray-300">
                          <span className="font-bold text-cyan-400">Date:</span>{" "}
                          {new Date(
                            parseInt(purchase.createdAt, 10)
                          ).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Data Message */}
              {!filteredTransactions?.length && !filteredPurchases?.length && (
                <div className="text-center text-gray-500">
                  No Data Available
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
