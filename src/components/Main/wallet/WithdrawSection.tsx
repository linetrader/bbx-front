"use client";

import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import OtpModal from "./OtpModal";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

export default function WithdrawSection({
  loading,
  walletData,
  miningData,
  pendingWithdrawals,
  handleSaveWithdrawAddress,
  handleConfirmWithdraw,
}: WithdrawSectionProps) {
  const { language } = useTranslationContext();
  const [translations, setTranslations] = useState<Record<string, string>>({
    withdrawWallet: "출금 지갑",
    enterWithdrawAddress: "출금 지갑 주소 입력",
    saveWithdrawAddress: "출금 지갑 주소 저장",
    savedWithdrawAddress: "주소",
    otpTitle: "OTP 입력",
    amountLabel: "수량",
    processing: "처리중...",
    withdraw: "출금",
    pendingWithdraws: "출금 대기중",
    noPendingWithdraws: "대기중인 출금이 없습니다.",
    currency: "토큰",
    amount: "수량",
    status: "상태",
    pendingStatus: "대기중",
    completedStatus: "완료됨",
    failedStatus: "실패",
    withdrawSuccess: "출금 요청이 성공적으로 제출되었습니다.",
  });
  const [otpInput, setOtp] = useState("");
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [otpMode, setOtpMode] = useState<"SAVE_ADDRESS" | "WITHDRAW" | null>(
    null
  );
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
  const [withdrawalAmounts, setWithdrawalAmounts] = useState<{
    [key in TokenType]: number;
  }>({
    USDT: 0.0,
    DOGE: 0.0,
    BTC: 0.0,
  });
  const [withdrawAddress, setWithdrawAddress] = useState<string>(
    walletData?.whithdrawAddress || ""
  );

  useEffect(() => {
    if (walletData) {
      setWithdrawAddress(walletData.whithdrawAddress);
    }
  }, [walletData]);

  const fetchTranslations = async () => {
    try {
      const result = {
        withdrawWallet: await fetchTranslation("출금 지갑", language),
        enterWithdrawAddress: await fetchTranslation(
          "출금 지갑 주소 입력",
          language
        ),
        saveWithdrawAddress: await fetchTranslation(
          "출금 지갑 주소 저장",
          language
        ),
        savedWithdrawAddress: await fetchTranslation("주소", language),
        otpTitle: await fetchTranslation("OTP 입력", language),
        amountLabel: await fetchTranslation("수량", language),
        processing: await fetchTranslation("처리중...", language),
        withdraw: await fetchTranslation("출금", language),
        pendingWithdraws: await fetchTranslation("출금 대기중", language),
        noPendingWithdraws: await fetchTranslation(
          "대기중인 출금이 없습니다.",
          language
        ),
        currency: await fetchTranslation("토큰", language),
        amount: await fetchTranslation("수량", language),
        status: await fetchTranslation("상태", language),
        pendingStatus: await fetchTranslation("대기중", language),
        completedStatus: await fetchTranslation("완료됨", language),
        failedStatus: await fetchTranslation("실패", language),
        withdrawSuccess: await fetchTranslation(
          "출금 요청이 성공적으로 제출되었습니다.",
          language
        ),
      };
      setTranslations(result);
    } catch (error) {
      console.error("Failed to fetch translations:", error);
    }
  };

  const handleSaveWithdrawAddressClick = () => {
    if (!withdrawAddress.trim()) {
      alert(translations.enterWithdrawAddress);
      return;
    }
    setOtpMode("SAVE_ADDRESS");
    setOtpModalOpen(true);
  };

  const handleWithdrawClick = (token: TokenType) => {
    setSelectedToken(token);
    setOtpMode("WITHDRAW");
    setOtpModalOpen(true);
  };

  const confirmOtpAction = async () => {
    if (otpMode === "SAVE_ADDRESS") {
      const success = await handleSaveWithdrawAddress(
        withdrawAddress,
        otpInput
      );
      if (success) {
        alert(translations.savedWithdrawAddress);
      }
    } else if (otpMode === "WITHDRAW" && selectedToken) {
      const success = await handleConfirmWithdraw(
        otpInput,
        selectedToken,
        withdrawalAmounts[selectedToken]
      );
      if (success) {
        alert(translations.withdrawSuccess);
      }
      setWithdrawalAmounts((prev) => ({
        ...prev,
        [selectedToken]: 0,
      }));
    }
    setOtp("");
    setOtpModalOpen(false);
    setOtpMode(null);
  };

  const handleInputChange = (token: TokenType, value: string) => {
    setWithdrawalAmounts((prev) => ({
      ...prev,
      [token]: parseFloat(value),
    }));
  };

  const getTranslatedStatus = (status: string): string => {
    const statusKeyMap: Record<string, string> = {
      pending: "pendingStatus",
      completed: "completedStatus",
      failed: "failedStatus",
    };
    const key = statusKeyMap[status] || status;
    return translations[key] || status;
  };

  const getBalanceByType = (type: string): string => {
    if (!miningData) return "0.000000";
    const balanceData = miningData.find((data) => data.packageType === type);
    return balanceData?.miningBalance
      ? parseFloat(balanceData.miningBalance.toString()).toFixed(6)
      : "0.000000";
  };

  function shortenAddress(
    address: string,
    start: number = 10,
    end: number = 10
  ): string {
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}......${address.slice(-end)}`;
  }

  function formatAddressForLineBreak(
    address: string,
    chunkSize: number = 16
  ): string {
    return (
      address.match(new RegExp(`.{1,${chunkSize}}`, "g"))?.join("\n") || address
    );
  }

  useEffect(() => {
    fetchTranslations();
  }, [language]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        {translations.withdrawWallet}
      </h1>

      <div className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800">
        {!walletData?.whithdrawAddress ||
        walletData.whithdrawAddress === "0x" ? (
          <div>
            <input
              type="text"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              placeholder={translations.enterWithdrawAddress}
              className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              onClick={handleSaveWithdrawAddressClick}
              disabled={loading}
              className={`px-4 py-2 rounded font-semibold shadow-md transition-colors text-white text-sm ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400"
              }`}
            >
              {translations.saveWithdrawAddress}
            </button>
          </div>
        ) : (
          <p className="text-gray-300 break-words">
            <strong>{translations.savedWithdrawAddress}: </strong>
            {formatAddressForLineBreak(walletData.whithdrawAddress)}
          </p>
        )}
      </div>

      {(["USDT", "DOGE"] as TokenType[]).map((token) => (
        <div
          key={token}
          className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800"
        >
          <label
            htmlFor={`${token}-withdraw`}
            className="block text-sm font-semibold text-gray-300 mb-2"
          >
            {token} {translations.amountLabel}:{" "}
            <span className="text-cyan-400">
              {token === "USDT"
                ? walletData?.usdtBalance || "0"
                : getBalanceByType(token)}
            </span>
          </label>
          <div className="flex items-center gap-6">
            <input
              id={`${token}-withdraw`}
              type="number"
              step="0.000001"
              value={
                isNaN(withdrawalAmounts[token]) ? "" : withdrawalAmounts[token]
              }
              onChange={(e) => handleInputChange(token, e.target.value)}
              placeholder={`Enter ${token.toUpperCase()} ${
                translations.amountLabel
              }`}
              className="w-1/2 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              onClick={() => {
                if (
                  !withdrawalAmounts[token] ||
                  withdrawalAmounts[token] <= 0
                ) {
                  toast.error("수량을 입력하세요.");
                  return;
                }
                handleWithdrawClick(token);
              }}
              disabled={loading}
              className={`px-4 py-2 rounded font-semibold shadow-md transition-colors text-white text-sm ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-400"
              }`}
            >
              {loading ? translations.processing : translations.withdraw}
            </button>
          </div>
        </div>
      ))}

      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        {translations.pendingWithdraws}
      </h1>
      <div className="mb-4 p-4 border rounded border-cyan-500 bg-gray-800">
        {pendingWithdrawals.length > 0 ? (
          <ul className="space-y-4">
            {pendingWithdrawals.map((withdrawal, index) => (
              <li key={index} className="p-4 bg-gray-700 rounded">
                <p className="text-sm text-gray-300">
                  <strong>{withdrawal.currency.toUpperCase()}</strong>:{" "}
                  {withdrawal.amount} - {getTranslatedStatus(withdrawal.status)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">
            {translations.noPendingWithdraws}
          </p>
        )}
      </div>
      <OtpModal
        isOpen={isOtpModalOpen}
        otp={otpInput}
        setOtp={setOtp}
        onClose={() => {
          setOtpModalOpen(false);
          setOtpMode(null);
        }}
        onConfirm={confirmOtpAction}
      />
    </div>
  );
}
