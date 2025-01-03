// src/components/ContractModal.tsx
import React, { useState } from "react";
import { usePackage } from "../../../hooks/usePackage";
import CustomerInfoForm from "./CustomerInfoForm";
import ContractInfo from "./ContractInfo";
import FullContractModal from "./FullContractModal";
import useCustomerInfo from "../../../hooks/useCustomerInfo";
import { useTranslation } from "next-i18next";

export default function ContractModal({
  selectedPackage,
  handleContractClose,
  handlePurchase,
}: {
  selectedPackage: any;
  handleContractClose: () => void;
  handlePurchase: (
    packageId: string,
    customerName: string,
    customerPhone: string,
    customerAddress: string
  ) => void;
}) {
  const { t } = useTranslation("contractModal"); // next-i18next 사용
  const { defaultContract } = usePackage();
  const { customerInfo, setCustomerInfo } = useCustomerInfo();
  const [showFullContract, setShowFullContract] = useState(false);

  const handleConfirmPurchase = () => {
    if (!customerInfo.name) {
      alert(t("alerts.enterName"));
      return;
    }
    if (!customerInfo.phone) {
      alert(t("alerts.enterPhone"));
      return;
    }
    if (!customerInfo.address) {
      alert(t("alerts.enterAddress"));
      return;
    }
    if (!customerInfo.agreed) {
      alert(t("alerts.agreeTerms"));
      return;
    }

    if (selectedPackage) {
      handlePurchase(
        selectedPackage.id,
        customerInfo.name,
        customerInfo.phone,
        customerInfo.address
      );
      handleContractClose();
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <main className="flex-grow bg-gray-900 p-6 rounded-lg pt-10">
        {showFullContract && defaultContract && (
          <div className="mt-0">
            <FullContractModal
              contractContent={defaultContract.content}
              closeModal={() => setShowFullContract(false)}
            />
          </div>
        )}

        {!showFullContract && defaultContract && (
          <div className="mt-0">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              {t("title")}
            </h2>

            {defaultContract ? (
              <ContractInfo
                contractContent={defaultContract.content}
                showFullContract={showFullContract}
                setShowFullContract={setShowFullContract}
              />
            ) : (
              <p className="text-gray-300 mb-6 text-center">{t("loading")}</p>
            )}

            <CustomerInfoForm
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
            />

            <div className="flex justify-between mt-6">
              <button
                onClick={handleContractClose}
                className="px-4 py-2 bg-red-500 text-white rounded-lg transition hover:bg-red-600"
              >
                {t("buttons.cancel")}
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg transition hover:bg-cyan-600"
              >
                {t("buttons.confirm")}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
