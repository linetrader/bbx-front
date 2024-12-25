// components/Wallet.tsx

// components/Wallet.tsx

"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import Image from "next/image";
import NIALogo from "@/assets/images/logos/NIA.png";
import { useAuth } from "@/context/AuthContext";

interface WalletData {
  address: string;
  usdtBalance: string;
  btcBalance: string;
}

export default function Wallet() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);

  const fetchWalletAddress = async () => {
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

      console.log("Fetched Wallet Data:", data);

      if (data.errors) {
        const errorMessage =
          data.errors[0]?.message || "Unknown error occurred.";
        if (errorMessage.includes("Wallet not found")) {
          setWalletData(null);
        } else {
          throw new Error(errorMessage);
        }
      } else {
        setWalletData(data.data.getWalletInfo);
      }
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

    try {
      const { data } = await api.post(
        "/graphql",
        {
          query: `
          mutation {
            createWallet {
              address
              usdtBalance
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
        throw new Error(data.errors[0]?.message || "Failed to create wallet.");
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
    fetchWalletAddress();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image
                src={NIALogo}
                alt="NIA Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-yellow-400 mb-6">
            Wallet Management
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-400 font-medium text-sm">
              Loading...
            </div>
          ) : walletData ? (
            <div className="text-left">
              <div className="mb-4">
                <p className="text-yellow-400 font-bold">Wallet Address:</p>
                <p className="font-mono break-all text-gray-300">
                  {walletData.address}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-yellow-400 font-bold">USDT Balance:</p>
                <p className="text-gray-300">{walletData.usdtBalance}</p>
              </div>
              <div className="mb-4">
                <p className="text-yellow-400 font-bold">BTC Balance:</p>
                <p className="text-gray-300">{walletData.btcBalance}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={createWallet}
              disabled={loading}
              className={`w-full py-2 mt-4 rounded font-semibold shadow-md transition-colors text-white text-sm ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-400"
              }`}
            >
              {loading ? "Creating Wallet..." : "Create Wallet"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
