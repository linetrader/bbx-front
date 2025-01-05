// hooks/useWallet.ts

import { useState } from "react";
import { useGraphQL } from "@/utils/graphqlApi";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/utils/socket";

interface DepositNotification {
  walletAddress: string;
  amount: number;
}

interface WalletData {
  address: string;
  whithdrawAddress: string;
  usdtBalance: string;
}

interface MiningData {
  packageType: string;
  miningBalance: string;
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
  const [miningData, setminingData] = useState<MiningData[] | null>([]);
  // const [withdrawalAmounts, setWithdrawalAmounts] = useState<
  //   Record<TokenType, number>
  // >({
  //   usdt: 0.0,
  //   doge: 0.0,
  //   btc: 0.0,
  // });
  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    WithdrawalRequest[]
  >([]);
  //const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);

  const [deposits, setDeposits] = useState<DepositNotification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchDepositWallet = async () => {
    try {
      //console.log("Fetching deposit wallet...");
      const { data } = await graphqlRequest(`
        query {
          getWalletInfo {
            address
            whithdrawAddress
            usdtBalance
          }
        }
      `);

      // Ensure that data exists and handle the response accordingly
      if (data?.getWalletInfo) {
        console.log(
          "Wallet Info Success - data.getWalletInfo",
          data.getWalletInfo
        );
        setWalletData(data.getWalletInfo);
      } else {
        setWalletData(null); // Wallet이 없으면 null 설정
        console.log("Wallet not found, user needs to create one.");
      }
    } catch (err: any) {
      //console.error("Error in fetchDepositWallet:", err);

      // Ensure err.message exists and is a string before calling `includes`
      if (err.message && typeof err.message === "string") {
        // Handle "Wallet not found" case
        if (err.message.includes("Wallet not found")) {
          setWalletData(null);
          console.log("Wallet not found, user needs to create one.");
        } else {
          // Handle other error messages
          setError(err.message || "An unexpected error occurred.");
        }
      } else {
        // In case `err.message` is not defined, set a generic error message
        setError("An unexpected error occurred.");
      }
    }
  };

  const fetchMiningData = async () => {
    try {
      //console.log("Fetching mining data...");
      const { data } = await graphqlRequest(`
        query {
          getUserMiningData {
            packageType
            miningBalance
          }
        }
      `);
      //console.log("Response received for getUserMiningData:", data);

      // 데이터가 없으면 null로 설정
      if (data?.getUserMiningData) {
        setminingData(data.getUserMiningData);
      } else {
        setminingData(null); // Wallet이 없으면 null 설정
      }
    } catch (err: any) {
      console.error("Error in fetchMiningData:", err);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const fetchPendingWithdrawals = async () => {
    try {
      console.log("Fetching pending withdrawals...");
      const { data } = await graphqlRequest(`
        query {
          getPendingWithdrawals {
            currency
            amount
            status
          }
        }
      `);
      //console.log("Response received for getPendingWithdrawals:", data);
      if (data?.getPendingWithdrawals) {
        setPendingWithdrawals(data.getPendingWithdrawals);
      } else {
        setPendingWithdrawals([]);
      }
    } catch (err: any) {
      console.error("Error in fetchPendingWithdrawals:", err);
      setError(err.message || "Failed to fetch pending withdrawals.");
    }
  };

  const createWallet = async () => {
    try {
      console.log("Creating wallet...");
      const { data } = await graphqlRequest(`
        mutation {
          createWallet {
            address
            usdtBalance
          }
        }
      `);
      console.log("Response received for createWallet:", data);
      if (data?.createWallet) {
        setWalletData(data.createWallet);
      } else {
        setError("Failed to create wallet.");
      }
    } catch (err: any) {
      console.error("Error in createWallet:", err);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  // const handleInputChange = (token: TokenType, value: number) => {
  //   setWithdrawalAmounts((prev) => ({
  //     ...prev,
  //     [token]: value,
  //   }));
  // };

  // const handleWithdrawClick = (token: TokenType) => {
  //   const amount = withdrawalAmounts[token];
  //   if (amount <= 0) {
  //     setError("Please enter a valid amount to withdraw.");
  //     return;
  //   }
  //   setSelectedToken(token);
  // };

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
      // console.log("Confirming withdrawal request...");
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

      //console.log("requestWithdrawal - ", data);

      if (data) {
        fetchDepositWallet(); // Refresh wallet balances
        fetchMiningData();
        fetchPendingWithdrawals(); // Refresh pending withdrawals
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
        fetchDepositWallet(); // Update wallet data after saving the address
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
