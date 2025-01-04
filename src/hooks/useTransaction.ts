import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";
import { PurchaseRecord, Transaction } from "./types/common";

export function useTransaction() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRecord[] | null>(null);

  const fetchTransactionData = async () => {
    //console.log("fetchTransactionData");
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
    //console.log("fetchPurchaseRecords");
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
      //console.log(data.getPackageRecords);
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
