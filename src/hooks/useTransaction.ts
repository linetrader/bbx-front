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

  const fetchPurchaseRecords = async (status = "approved") => {
    setError(null); // 이전 에러 상태 초기화
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
        { status } // GraphQL 쿼리 변수로 status 전달
      );

      console.log(data.getPackageRecords);
      setPurchases(data.getPackageRecords);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setPurchases([]);
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
