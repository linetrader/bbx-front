import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";
import { PurchaseRecord, Transaction } from "../types/Common";

export function useTransaction(selectedType: string) {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRecord[] | null>(null);
  const [miningLogs, setMiningLogs] = useState<
    { date: Date; profit: number; packageType: string }[] | null
  >(null);

  const fetchTransactionData = async () => {
    setError(null);
    setTransactions(null);
    try {
      const { data } = await graphqlRequest(
        `query GetTransactionList($type: String!) {
          getTransactionList(type: $type) {
            type
            amount
            token
            transactionHash
            createdAt
          }
        }`,
        { type: selectedType }
      );
      setTransactions(data.getTransactionList);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setTransactions(null);
    }
  };

  const fetchPurchaseRecords = async (status = "approved") => {
    setError(null);
    setPurchases(null);
    try {
      const { data } = await graphqlRequest(
        `query GetPackageRecords($status: String!) {
          getPackageRecords(status: $status) {
            packageName
            quantity
            totalPrice
            createdAt
          }
        }`,
        { status }
      );
      setPurchases(data.getPackageRecords);
    } catch (err: any) {
      setError(
        err === "Packages not found."
          ? null
          : err.message || "An unexpected error occurred."
      );
      setPurchases([]);
    }
  };

  const fetchMiningLogsGroupedByDay = async (limit = 10, offset = 0) => {
    setError(null);
    setMiningLogs(null);
    try {
      const { data } = await graphqlRequest(
        `query GetAllMiningLogsGroupedByDay($limit: Int!, $offset: Int!) {
          getAllMiningLogsGroupedByDay(limit: $limit, offset: $offset) {
            date
            profit
            packageType
          }
        }`,
        { limit, offset }
      );
      setMiningLogs(data.getAllMiningLogsGroupedByDay);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setMiningLogs(null);
    }
  };

  useEffect(() => {
    if (selectedType === "package_purchase") {
      fetchPurchaseRecords();
    } else if (selectedType === "minings") {
      fetchMiningLogsGroupedByDay();
    } else {
      fetchTransactionData();
    }
  }, [selectedType]);

  return {
    transactions,
    purchases,
    miningLogs,
    loading,
    error,
    fetchTransactionData,
    fetchPurchaseRecords,
    fetchMiningLogsGroupedByDay,
  };
}
