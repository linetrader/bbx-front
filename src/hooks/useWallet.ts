import { useState } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

export function useWallet() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [miningData, setminingData] = useState<MiningData[] | null>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    WithdrawalRequest[]
  >([]);

  const fetchDepositWallet = async () => {
    try {
      const { data } = await graphqlRequest(`
        query {
          getWalletInfo {
            address
            whithdrawAddress
            usdtBalance
          }
        }
      `);

      if (data?.getWalletInfo) {
        setWalletData(data.getWalletInfo);
      } else {
        setWalletData(null);
      }
    } catch (err: any) {
      if (err.message && typeof err.message === "string") {
        if (err.message.includes("Wallet not found")) {
          setWalletData(null);
        } else {
          setError(err.message || "An unexpected error occurred.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const fetchMiningData = async () => {
    try {
      const { data } = await graphqlRequest(`
        query {
          getUserMiningData {
            packageType
            miningBalance
          }
        }
      `);

      if (data?.getUserMiningData) {
        setminingData(data.getUserMiningData);
      } else {
        setminingData(null);
      }
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
          }
        }
      `);

      if (data?.getPendingWithdrawals) {
        setPendingWithdrawals(data.getPendingWithdrawals);
      } else {
        setPendingWithdrawals([]);
      }
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
            whithdrawAddress
            usdtBalance
          }
        }
      `);

      if (data?.createWallet) {
        setWalletData(data.createWallet);
      } else {
        setError("Failed to create wallet.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleConfirmWithdraw = async (
    otpValue: string,
    selectedToken: string,
    amount: number
  ): Promise<boolean> => {
    if (amount <= 0) {
      setError("Please enter a valid amount to withdraw.");
      return false;
    }

    try {
      const { data } = await graphqlRequest(
        `
          mutation RequestWithdrawal($currency: String!, $amount: Float!, $otp: String!) {
            requestWithdrawal(currency: $currency, amount: $amount, otp: $otp)
          }
        `,
        {
          currency: selectedToken,
          amount: parseFloat(amount.toString()),
          otp: otpValue,
        }
      );

      if (data) {
        fetchDepositWallet();
        fetchMiningData();
        fetchPendingWithdrawals();
        return true;
      }
    } catch (error: any) {
      if (error) {
        alert(error);
        return false;
      }
    }
    return false;
  };

  const saveWithdrawAddress = async (
    newAddress: string,
    otp: string
  ): Promise<boolean> => {
    try {
      const { data } = await graphqlRequest(
        `
          mutation SaveWithdrawAddress($newAddress: String!, $otp: String!) {
            saveWithdrawAddress(newAddress: $newAddress, otp: $otp)
          }
        `,
        {
          newAddress,
          otp,
        }
      );

      if (data?.saveWithdrawAddress) {
        fetchDepositWallet();
        return true;
      }
      setError("Failed to save withdraw address.");
      return false;
    } catch (err: any) {
      alert(
        err.message || "An error occurred while saving the withdraw address."
      );
      return false;
    }
  };

  return {
    walletData,
    miningData,
    pendingWithdrawals,
    loading,
    error,
    fetchDepositWallet,
    fetchMiningData,
    fetchPendingWithdrawals,
    createWallet,
    handleConfirmWithdraw,
    saveWithdrawAddress,
  };
}
