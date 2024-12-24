// components/Wallet.tsx

"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import Image from "next/image";
import NIALogo from "@/assets/images/logos/NIA.png";
import FooterNavigation from "@/components/FooterNavigation";

export default function Wallet() {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);

  const fetchWalletAddress = async () => {
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found. Please log in again.");
      setWalletAddress(null); // 월렛이 없음을 표시
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/graphql", {
        query: `
          query GetWalletAddress($userId: String!) {
            getWalletAddress(userId: $userId)
          }
        `,
        variables: { userId },
      });

      if (data.errors) {
        const errorMessage =
          data.errors[0]?.message || "Unknown error occurred.";
        if (errorMessage.includes("Wallet not found")) {
          setWalletAddress(null); // 월렛이 없는 경우 처리
        } else {
          throw new Error(errorMessage); // 기타 에러 처리
        }
      } else {
        setWalletAddress(data.data.getWalletAddress); // 월렛 주소 저장
      }
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred while fetching the wallet."
      );
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    setLoading(true);
    setError(null);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/graphql", {
        query: `
          mutation CreateWallet($userId: String!) {
            createWallet(userId: $userId)
          }
        `,
        variables: { userId },
      });

      if (data.errors) {
        throw new Error(data.errors[0]?.message || "Failed to create wallet.");
      }

      setWalletAddress(data.data.createWallet); // 성공 시 지갑 주소 저장
    } catch (err: any) {
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
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image
                src={NIALogo}
                alt="NIA Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">
            Wallet Management
          </h1>
          {error && !walletAddress && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {walletAddress === undefined ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : walletAddress ? (
            <div className="text-center text-green-500">
              <p className="mb-4">Wallet Address</p>
              <p className="font-mono break-all">{walletAddress}</p>
            </div>
          ) : (
            <button
              onClick={createWallet}
              disabled={loading}
              className={`w-full py-2 rounded font-semibold ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-400 text-black"
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
