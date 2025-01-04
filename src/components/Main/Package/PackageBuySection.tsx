// src/components/PackageBuySection.tsx

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

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
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    packageBuy: "Package Buy",
    myUsdtBalance: "My USDT Balance",
    loading: "Loading...",
    buy: "구매",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("Package Buy", language),
        translateText("My USDT Balance", language),
        translateText("Loading...", language),
        translateText("구매", language),
      ]);

      setTranslatedTexts({
        packageBuy: translations[0],
        myUsdtBalance: translations[1],
        loading: translations[2],
        buy: translations[3],
      });
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
              {pkg.name} mining ({pkg.price} USDT)
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
                {translatedTexts.buy}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
