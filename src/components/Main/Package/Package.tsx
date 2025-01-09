// src/components/Package.tsx

import React from "react";
import { usePackage } from "../../../hooks/usePackage";
import { useTransaction } from "../../../hooks/useTransaction";
import PackageBuySection from "./PackageBuySection";
import MyPurchasesSection from "./MyPurchasesSection";
import ContractModal from "./ContractModal";

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

            {/* Pending Purchases Section */}
            <div className="p-4 border rounded border-cyan-500 bg-gray-800">
              <h3 className="text-lg font-bold text-cyan-500 mb-4">
                Pending Purchases
              </h3>

              {transactionLoading && (
                <p className="text-gray-400">Loading pending purchases...</p>
              )}

              {transactionError && (
                <p className="text-red-500">{transactionError}</p>
              )}

              {!transactionLoading &&
                (!pendingPurchases || pendingPurchases.length === 0) && (
                  <p className="text-gray-400">No pending purchases found.</p>
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
                            Quantity:
                          </span>{" "}
                          {purchase.quantity}
                        </p>
                        <p className="text-gray-400">
                          <span className="font-bold text-white">
                            Total Price:
                          </span>{" "}
                          ${purchase.totalPrice}
                        </p>
                        <p className="text-gray-400">
                          <span className="font-bold text-white">
                            Created At:
                          </span>{" "}
                          {new Date(
                            Number(purchase.createdAt)
                          ).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
