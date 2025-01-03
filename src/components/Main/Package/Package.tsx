// src/components/Package.tsx

import React from "react";
import { usePackage } from "../../../hooks/usePackage";
import PackageBuySection from "./PackageBuySection";
import MyPurchasesSection from "./MyPurchasesSection";
import ContractModal from "./ContractModal";

export default function Package() {
  const {
    packages,
    quantities,
    usdtBalance,
    userPackages,
    loading,
    error,
    setQuantities,
    handlePurchase,
    handleContractOpen,
    handleContractClose,
    showContract,
    selectedPackage,
  } = usePackage();

  return (
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow pt-10">
        {showContract && selectedPackage && (
          <div className="mt-0">
            <ContractModal
              selectedPackage={selectedPackage}
              handleContractClose={handleContractClose}
              handlePurchase={handlePurchase}
            />
          </div>
        )}

        {!showContract && !selectedPackage && (
          <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
            <PackageBuySection
              packages={packages}
              quantities={quantities}
              setQuantities={setQuantities}
              handleContractOpen={handleContractOpen}
              usdtBalance={usdtBalance}
              loading={loading}
              error={error}
            />
            <MyPurchasesSection userPackages={userPackages} error={error} />
          </div>
        )}
      </main>
    </div>
  );
}
