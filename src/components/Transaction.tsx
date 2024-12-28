// components/Transaction.tsx

"use client";

import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";
import TransactionView from "@/components/TransactionView";

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

export default function Transaction() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRecord[] | null>(null);

  const fetchTransactionData = async () => {
    try {
      const { data } = await graphqlRequest(
        `query {
          getTransactionList {
            type
            amount
            token
            transactionHash
            createdAt
          }
        }`
      );

      setTransactions(data.getTransactionList);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setTransactions(null);
    }
  };

  const fetchPurchaseRecords = async () => {
    try {
      const { data } = await graphqlRequest(
        `query {
          getPurchaseRecords {
            packageName
            quantity
            totalPrice
            createdAt
          }
        }`
      );

      setPurchases(data.getPurchaseRecords);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setPurchases(null);
    }
  };

  useEffect(() => {
    fetchTransactionData();
    fetchPurchaseRecords();
  }, []);

  return (
    <TransactionView
      transactions={transactions}
      purchases={purchases}
      loading={loading}
      error={error}
    />
  );
}
