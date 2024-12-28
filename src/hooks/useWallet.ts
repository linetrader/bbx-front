import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

interface WalletData {
  address: string;
  usdtBalance: string;
  dogeBalance: string;
  btcBalance: string;
}

export function useWallet() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [walletData, setWalletData] = useState<WalletData | null>(null);

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

  return {
    walletData,
    loading,
    error,
    fetchWallet,
    createWallet,
  };
}
