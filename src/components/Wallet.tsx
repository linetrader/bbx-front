// components/Wallet.tsx
"use client";

import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";
import WalletView from "@/components/WalletView";

export default function Wallet() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [walletData, setWalletData] = useState(null);

  const fetchWallet = async () => {
    try {
      const { data } = await graphqlRequest(`
        query {
          getWalletInfo {
            address
            usdtBalance
            dogeBalance
            btcBalance
          }
        }
      `);

      setWalletData(data.getWalletInfo);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const createWallet = async () => {
    try {
      const { data } = await graphqlRequest(`
        mutation {
          createWallet {
            address
            usdtBalance
            dogeBalance
            btcBalance
          }
        }
      `);

      setWalletData(data.createWallet);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
