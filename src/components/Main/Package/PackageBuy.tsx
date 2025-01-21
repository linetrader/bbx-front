"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";
import { PackageBuyProps } from "@/types/Package";

export function PackageBuy({
  availablePackages = [],
  packageQuantities,
  setPackageQuantities,
  openContractModal,
  usdtBalance,
  loading,
  error,
  userPackages,
  pendingPurchases,
  transactionLoading,
  transactionError,
}: PackageBuyProps) {
  const { language } = useTranslationContext();
  const [translatedTexts, setTranslatedTexts] = useState({
    packageBuy: "패키지 구매",
    myUsdtBalance: "내 USDT 잔액",
    loading: "로딩 중...",
    buy: "구매",
    walletNotFound: "지갑을 찾을 수 없습니다. 지갑을 생성하세요.",
    title: "내 패키지",
    walletError: "지갑을 찾을 수 없습니다. 지갑을 생성하세요.",
    noPurchases: "구매 내역이 없습니다.",
    pendingPurchases: "대기 중인 구매",
    noPendingPurchases: "대기 중인 구매 내역이 없습니다.",
    quantity: "수량",
    totalPrice: "총 가격",
    createdAt: "생성일",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "packageBuy", text: "패키지 구매" },
          { key: "myUsdtBalance", text: "내 USDT 잔액" },
          { key: "loading", text: "로딩 중..." },
          { key: "buy", text: "구매" },
          {
            key: "walletNotFound",
            text: "지갑을 찾을 수 없습니다. 지갑을 생성하세요.",
          },
          { key: "title", text: "내 패키지" },
          {
            key: "walletError",
            text: "지갑을 찾을 수 없습니다. 지갑을 생성하세요.",
          },
          { key: "noPurchases", text: "구매 내역이 없습니다." },
          { key: "pendingPurchases", text: "대기 중인 구매" },
          {
            key: "noPendingPurchases",
            text: "대기 중인 구매 내역이 없습니다.",
          },
          { key: "quantity", text: "수량" },
          { key: "totalPrice", text: "총 가격" },
          { key: "createdAt", text: "생성일" },
        ];

        const translations = await Promise.all(
          keys.map((item) => fetchTranslation(item.text, language))
        );

        const updatedTexts = keys.reduce(
          (acc, item, index) => {
            acc[item.key as keyof typeof translatedTexts] = translations[index];
            return acc;
          },
          { ...translatedTexts }
        );

        setTranslatedTexts(updatedTexts);
      } catch (error) {
        console.error("[ERROR] Failed to fetch translations:", error);
      }
    };

    fetchTranslations();
  }, [language]);

  const inputStyles =
    "w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800 text-white placeholder-gray-500";
  const buttonStyles =
    "px-4 py-2 rounded font-bold transition-colors bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg";

  return (
    <div>
      <h2 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        {translatedTexts.packageBuy}
      </h2>
      <h3 className="text-xl text-cyan-400 font-semibold mb-6 text-left">
        {translatedTexts.myUsdtBalance}:{" "}
        <span className="text-gray-100">{usdtBalance} USDT</span>
      </h3>
      {loading ? (
        <div className="text-center text-gray-400">
          {translatedTexts.loading}
        </div>
      ) : error ? (
        error === "Wallet not found" ? (
          <div className="px-4 py-3 rounded mb-4 text-sm bg-yellow-100 text-yellow-700 border-yellow-600">
            {translatedTexts.walletNotFound}
          </div>
        ) : (
          <div className="bg-red-600/70 text-white border border-red-500 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )
      ) : (
        availablePackages.map((pkg) => (
          <div
            key={pkg.id}
            className="mb-6 p-4 border rounded border-cyan-500 bg-gray-800"
          >
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              {pkg.name} mining ({pkg.price} USDT)
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={packageQuantities[pkg.id] || ""}
                onChange={(e) =>
                  setPackageQuantities({
                    ...packageQuantities,
                    [pkg.id]: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                placeholder="0.0"
                className={inputStyles}
              />
              <button
                className={buttonStyles}
                onClick={() => {
                  if (
                    !packageQuantities[pkg.id] ||
                    packageQuantities[pkg.id] <= 0
                  ) {
                    toast.error("수량을 입력하세요.");
                    return;
                  }
                  openContractModal(pkg); // 수량이 0보다 큰 경우에만 동작
                }}
              >
                {translatedTexts.buy}
              </button>
            </div>
          </div>
        ))
      )}

      <h2 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        {translatedTexts.title}
      </h2>
      <div className="p-4 border rounded border-cyan-500 bg-gray-800">
        {error === "Wallet not found." && (
          <div className="bg-yellow-100 text-yellow-700 border border-yellow-600 px-4 py-3 rounded mb-4">
            {translatedTexts.walletError}
          </div>
        )}
        {userPackages.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-300">
            {userPackages.map((record) => (
              <li key={record.packageType} className="mb-2">
                {record.packageType} mining - {record.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">
            {translatedTexts.noPurchases}
          </p>
        )}
      </div>

      <div className="p-4 border rounded border-cyan-500 bg-gray-800">
        <h3 className="text-lg font-bold text-cyan-500 mb-4">
          {translatedTexts.pendingPurchases}
        </h3>

        {transactionLoading && (
          <p className="text-gray-400">{translatedTexts.loading}</p>
        )}

        {transactionError && <p className="text-red-500">{transactionError}</p>}

        {!transactionLoading &&
          (!pendingPurchases || pendingPurchases.length === 0) && (
            <p className="text-gray-400">
              {translatedTexts.noPendingPurchases}
            </p>
          )}

        {!transactionLoading &&
          pendingPurchases &&
          pendingPurchases.length > 0 && (
            <div className="p-4 border rounded border-cyan-500 bg-gray-800">
              {pendingPurchases.map((purchase, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
                >
                  <h4 className="text-white font-bold mb-2">
                    {purchase.packageName}
                  </h4>
                  <p className="text-gray-400">
                    <span className="font-bold text-white">
                      {translatedTexts.quantity}:
                    </span>{" "}
                    {purchase.quantity}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-bold text-white">
                      {translatedTexts.totalPrice}:
                    </span>{" "}
                    ${purchase.totalPrice}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-bold text-white">
                      {translatedTexts.createdAt}:
                    </span>{" "}
                    {new Date(Number(purchase.createdAt)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
