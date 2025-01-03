// src/components/PackageBuySection.tsx

import React from "react";
import { useTranslation } from "next-i18next";

interface PackageBuySectionProps {
  packages: any[];
  quantities: { [key: string]: number };
  setQuantities: (quantities: { [key: string]: number }) => void;
  handleContractOpen: (pkg: any) => void;
  usdtBalance: number;
  loading: boolean;
  error: string | null;
}

export default function PackageBuySection({
  packages,
  quantities,
  setQuantities,
  handleContractOpen,
  usdtBalance,
  loading,
  error,
}: PackageBuySectionProps) {
  const { t } = useTranslation("packageBuySection"); // next-i18next 사용

  const inputStyles =
    "w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800 text-white placeholder-gray-500";
  const buttonStyles =
    "px-4 py-2 rounded font-bold transition-colors bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg";

  return (
    <div>
      <h2 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        {t("title")}
      </h2>
      <h3 className="text-xl font-semibold text-gray-100 mb-6 text-center">
        {t("balance")}:{" "}
        <span className="text-cyan-400">{usdtBalance} USDT</span>
      </h3>
      {loading ? (
        <div className="text-center text-gray-400">{t("loading")}</div>
      ) : error && error !== "Wallet not found." ? (
        <div className="bg-red-600/70 text-white border border-red-500 px-4 py-3 rounded mb-6 text-center">
          {error}
        </div>
      ) : (
        packages.map((pkg) => (
          <div
            key={pkg.id}
            className="mb-6 p-4 border rounded border-cyan-500 bg-gray-800"
          >
            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              {pkg.name} {t("mining")} ({pkg.price} USDT)
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={quantities[pkg.id] || ""}
                onChange={(e) =>
                  setQuantities({
                    ...quantities,
                    [pkg.id]: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                placeholder="0.0"
                className={inputStyles}
              />
              <button
                className={buttonStyles}
                onClick={() => handleContractOpen(pkg)}
              >
                {t("buy")}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
