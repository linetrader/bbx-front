// src/components/Package.tsx

"use client";

import React from "react";
import { usePackage } from "../../../hooks/usePackage";
import { useTransaction } from "../../../hooks/useTransaction";
import PackageBuySection from "./PackageBuySection";
import MyPurchasesSection from "./MyPurchasesSection";
import ContractModal from "./ContractModal";
import PendingPurchasesSection from "./PendingPurchasesSection"; // Import 추가

export default function Package() {
  const {
    packages,
    quantities,
    usdtBalance,
    userPackages,
    loading: packageLoading,
    error: packageError,
    setQuantities,
    handlePurchase,
    handleContractOpen,
    handleContractClose,
    showContract,
    selectedPackage,
  } = usePackage();

  const {
    purchases: pendingPurchases,
    loading: transactionLoading,
    error: transactionError,
    fetchPurchaseRecords,
  } = useTransaction();

  // Fetch pending purchases on component mount
  React.useEffect(() => {
    fetchPurchaseRecords("pending");
  }, []);

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
              loading={packageLoading}
              error={packageError}
            />
            <MyPurchasesSection
              userPackages={userPackages}
              error={packageError}
            />
            <PendingPurchasesSection
              pendingPurchases={pendingPurchases}
              loading={transactionLoading}
              error={transactionError}
            />
          </div>
        )}
      </main>
    </div>
  );
}
