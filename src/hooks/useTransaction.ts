import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";
import { PurchaseRecord, Transaction } from "./types/common";

export function useTransaction(selectedType: string) {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRecord[] | null>(null);

  const fetchTransactionData = async () => {
    setError(null); // 이전 에러 상태 초기화
    setTransactions(null);
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
    //console.log("fetchPurchaseRecords");
    setError(null); // 이전 에러 상태 초기화
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
        { status } // GraphQL 쿼리 변수로 status 전달
      );

      //console.log(data.getPackageRecords);
      setPurchases(data.getPackageRecords);
    } catch (err: any) {
      //console.log("fetchPurchaseRecords - err : ", err);
      // `Packages not found.` 에러일 경우
      if (err === "Packages not found.") {
        setError(null); // 에러 상태를 null로 설정
      } else {
        // 다른 에러 메시지는 그대로 설정
        setError(err || "An unexpected error occurred.");
      }
      setPurchases([]);
    }
  };

  useEffect(() => {
    if (selectedType === "package_purchase") {
      fetchPurchaseRecords();
    } else {
      fetchTransactionData();
    }
  }, [selectedType]);

  return {
    transactions,
    purchases,
    loading,
    error,
    fetchTransactionData,
    fetchPurchaseRecords,
  };
}
