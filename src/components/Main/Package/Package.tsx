"use client";

import React, { useEffect, useState } from "react";
import { usePackage } from "../../../hooks/usePackage";
import { useTransaction } from "../../../hooks/useTransaction";
import { PackageBuy } from "./PackageBuy";
import ContractModal from "./ContractModal";
import type { Package } from "@/types/Package";

export default function Package() {
  const {
    availablePackages,
    packageQuantities,
    usdtBalance,
    userPackages,
    loading: packageLoading,
    error: packageError,
    setPackageQuantities,
    handlePackagePurchase,
    fetchUsdtBalance,
    fetchAvailablePackages,
    fetchUserPackages,
    fetchDefaultContract,
  } = usePackage();

  const {
    purchases: pendingPurchases,
    loading: transactionLoading,
    error: transactionError,
    fetchPurchaseRecords,
  } = useTransaction("package_purchase");

  const [isContractVisible, setIsContractVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const openContractModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsContractVisible(true);
  };

  const closeContractModal = () => {
    setSelectedPackage(null);
    setIsContractVisible(false);
  };

  useEffect(() => {
    fetchUsdtBalance();
    fetchAvailablePackages();
    fetchUserPackages();
    fetchDefaultContract();
    fetchPurchaseRecords("pending");
  }, []);

  return (
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow pt-10">
        {isContractVisible && selectedPackage && (
          <div className="mt-0">
            <ContractModal
              selectedPackage={selectedPackage}
              handleContractClose={closeContractModal}
              handlePurchase={handlePackagePurchase}
            />
          </div>
        )}

        {!isContractVisible && !selectedPackage && (
          <div className="w-[90%] max-w-xl mx-auto bg-gray-900/80 p-8 rounded-lg shadow-2xl border border-cyan-500">
            <PackageBuy
              availablePackages={availablePackages}
              packageQuantities={packageQuantities}
              setPackageQuantities={setPackageQuantities}
              openContractModal={openContractModal}
              usdtBalance={usdtBalance}
              loading={packageLoading}
              error={packageError}
              userPackages={userPackages}
              pendingPurchases={pendingPurchases}
              transactionLoading={transactionLoading}
              transactionError={transactionError}
            />
          </div>
        )}
      </main>
    </div>
  );
}
