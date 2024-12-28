// src/components/TransactionView.tsx

"use client";

import { useState } from "react";

interface Transaction {
  type: string;
  amount: string;
  token: string;
  transactionHash: string;
  createdAt: string;
}

interface PurchaseRecord {
  packageName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

interface TransactionViewProps {
  transactions: Transaction[] | null;
  purchases: PurchaseRecord[] | null;
  loading: boolean;
  error: string | null;
}

export default function TransactionView({
  transactions,
  purchases,
  loading,
  error,
}: TransactionViewProps) {
  const [selectedType, setSelectedType] = useState<string>("deposit");

  //console.log("transactions", transactions);

  // 필터링된 트랜잭션
  const filteredTransactions =
    selectedType === "Deposits" || selectedType === "Withdrawals"
      ? transactions
      : transactions?.filter((t) => t.type === selectedType);

  //console.log("purchases", purchases);

  // PurchaseRecord는 'all' 또는 'package_purchase' 항목에서만 표시
  const filteredPurchases =
    selectedType === "package_purchase" ? purchases : [];

  const transactionTypes = [
    { label: "Deposits", value: "deposit" },
    { label: "Withdrawals", value: "withdrawal" },
    { label: "Package Purchases", value: "package_purchase" },
    { label: "Referral Earnings", value: "referral_earning" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white pt-3">
      <div className="flex justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
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
              {/* 콤보박스 */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-300 mb-2">
                  Filter by Type
                </h2>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 w-full"
                >
                  {transactionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 필터링된 트랜잭션 목록 */}
              <div
                className="overflow-y-auto"
                style={{
                  height: "calc(100vh - 400px)",
                  paddingBottom: "1rem",
                }}
              >
                {filteredTransactions && filteredTransactions.length > 0 ? (
                  <div className="text-sm text-white">
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
                ) : (
                  <div></div>
                )}
                {/* Purchase Records */}
                {filteredPurchases && filteredPurchases.length > 0 && (
                  <div className="text-sm text-white">
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
