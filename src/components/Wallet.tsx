// components/Wallet.tsx

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import WalletView from "@/components/WalletView";
import { useApiState } from "@/hooks/useApiState";

export default function Wallet() {
  const { token } = useAuth();
  const [walletData, setWalletData] = useState(null);
  const { loading, setLoading, error, setError } = useApiState();

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication token is missing.");
      setWalletData(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(
        "/graphql",
        {
          query: `
          query {
            getWalletInfo {
              address
              usdtBalance
              dogeBalance
              btcBalance
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

      //console.log("Fetched Wallet Data:", data);

      if (data.errors) {
        const serverMessage =
          data.errors[0]?.message ||
          "An unexpected error occurred on the server.";
        setError(serverMessage);
        return;
      }
      setWalletData(data.data.getWalletInfo);
    } catch (err: any) {
      console.error("Error fetching wallet data:", err);
      setError(
        err.message ||
          "An unexpected error occurred while fetching wallet data."
      );
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication token is missing.");
      setWalletData(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(
        "/graphql",
        {
          query: `
          mutation {
            createWallet {
              address
              usdtBalance
              dogeBalance
              btcBalance
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

      console.log("Created Wallet Data:", data);

      if (data.errors) {
        const serverMessage =
          data.errors[0]?.message ||
          "An unexpected error occurred on the server.";
        setError(serverMessage);
        return;
      }

      setWalletData(data.data.createWallet);
    } catch (err: any) {
      console.error("Error creating wallet:", err);
      setError(
        err.message || "An unexpected error occurred while creating the wallet."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <WalletView
      walletData={walletData}
      loading={loading}
      error={error}
      createWallet={createWallet}
    />
  );
}
