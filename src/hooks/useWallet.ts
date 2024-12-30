// hooks/useWallet.ts
import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

interface WalletData {
  address: string;
  usdtBalance: string;
  dogeBalance: string;
  btcBalance: string;
}

interface WithdrawalRequest {
  currency: string;
  amount: string;
  status: string;
  createdAt: string;
}

type TokenType = "usdt" | "doge" | "btc";

export function useWallet() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [withdrawalAmounts, setWithdrawalAmounts] = useState<
    Record<TokenType, string>
  >({
    usdt: "",
    doge: "",
    btc: "",
  });
  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    WithdrawalRequest[]
  >([]);
  const [otp, setOtp] = useState("");
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);

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

  const fetchPendingWithdrawals = async () => {
    try {
      const { data } = await graphqlRequest(`
        query {
          getPendingWithdrawals {
            currency
            amount
            status
            createdAt
          }
        }
      `);
      setPendingWithdrawals(data.getPendingWithdrawals);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending withdrawals.");
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

  const handleInputChange = (token: TokenType, value: string) => {
    setWithdrawalAmounts((prev) => ({
      ...prev,
      [token]: value,
    }));
  };

  const handleWithdrawClick = (token: TokenType) => {
    const amount = withdrawalAmounts[token];
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount to withdraw.");
      return;
    }
    setSelectedToken(token);
  };

  const handleConfirmWithdraw = async (otpValue: string) => {
    if (!selectedToken) return;

    const amount = withdrawalAmounts[selectedToken];
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount to withdraw.");
      return;
    }

    try {
      await graphqlRequest(
        `
          mutation RequestWithdrawal($currency: String!, $amount: Float!, $otp: String!) {
            requestWithdrawal(currency: $currency, amount: $amount, otp: $otp)
          }
        `,
        {
          currency: selectedToken.toUpperCase(),
          amount: parseFloat(amount),
          otp: otpValue,
        }
      );

      alert("Withdrawal request submitted successfully.");
      fetchWallet(); // Refresh wallet balances
      fetchPendingWithdrawals(); // Refresh pending withdrawals
    } catch (error: any) {
      setError(error.message || "Failed to process withdrawal request.");
    } finally {
      setOtp("");
      setSelectedToken(null);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchPendingWithdrawals();
  }, []);

  return {
    walletData,
    pendingWithdrawals,
    loading,
    error,
    fetchWallet,
    fetchPendingWithdrawals,
    createWallet,
    withdrawalAmounts,
    handleInputChange,
    handleWithdrawClick,
    handleConfirmWithdraw,
    otp,
    setOtp,
    selectedToken,
  };
}
