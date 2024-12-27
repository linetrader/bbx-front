// components/Transaction.tsx

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import TransactionView from "@/components/TransactionView";

interface Transaction {
  type: string;
  amount: string;
  token: string;
  transactionHash: string;
}

export default function Transaction() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactionData = async () => {
    setLoading(true);
    setError(null);

    if (!token || typeof token !== "string") {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(
        "/graphql",
        {
          query: `
            query {
              getTransactionList {
                type
                amount
                token
                transactionHash
              }
            }
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.errors) {
        const serverMessage =
          data.errors[0]?.message ||
          "An unexpected error occurred on the server.";
        setError(serverMessage);
        setLoading(false);
        return;
      }

      setTransactions(data.data.getTransactionList);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setTransactions(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  return (
    <TransactionView
      transactions={transactions}
      loading={loading}
      error={error}
    />
  );
}
