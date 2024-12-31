// hooks/useWallet.ts
import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";
import { io, Socket } from "socket.io-client";

interface DepositNotification {
  walletAddress: string;
  amount: number;
}

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

  const [deposits, setDeposits] = useState<DepositNotification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchDepositWallet = async () => {
    try {
      const { data } = await graphqlRequest(`
        query {
          getWalletInfo {
            address
            usdtBalance
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
      fetchDepositWallet(); // Refresh wallet balances
      fetchPendingWithdrawals(); // Refresh pending withdrawals
    } catch (error: any) {
      setError(error.message || "Failed to process withdrawal request.");
    } finally {
      setOtp("");
      setSelectedToken(null);
    }
  };

  // useEffect(() => {
  //   fetchWallet();
  //   fetchPendingWithdrawals();
  // }, []);

  useEffect(() => {
    // WebSocket 연결 생성
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // 기본값은 로컬호스트
    console.log("apiUrl : ", apiUrl);
    const newSocket = io(apiUrl);
    setSocket(newSocket);

    // usdtDeposit 이벤트 수신
    newSocket.on(
      "usdtDeposit",
      (data: { walletAddress: string; amount: number }) => {
        console.log("Deposit notification received:", data);

        // 월렛 데이터 업데이트
        setWalletData((prev) =>
          prev
            ? {
                ...prev,
                usdtBalance: (
                  parseFloat(prev.usdtBalance) + data.amount
                ).toFixed(6),
              }
            : prev
        );
      }
    );

    // 컴포넌트 언마운트 시 소켓 연결 종료
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return {
    walletData,
    pendingWithdrawals,
    loading,
    error,
    fetchDepositWallet,
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
