import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

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

export function useTransaction() {
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
          getPackageRecords {
            packageName
            quantity
            totalPrice
            createdAt
          }
        }`
      );
      setPurchases(data.getPackageRecords);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setPurchases(null);
    }
  };

  useEffect(() => {
    fetchTransactionData();
    fetchPurchaseRecords();
  }, []);

  return {
    transactions,
    purchases,
    loading,
    error,
    fetchTransactionData,
    fetchPurchaseRecords,
  };
}
