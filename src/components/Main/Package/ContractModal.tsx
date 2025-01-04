// src/components/ContractModal.tsx

"use client";

import React, { useEffect, useState } from "react";
import { usePackage } from "../../../hooks/usePackage";
import CustomerInfoForm from "./CustomerInfoForm";
import ContractInfo from "./ContractInfo";
import FullContractModal from "./FullContractModal";
import useCustomerInfo from "../../../hooks/useCustomerInfo";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

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
  const { defaultContract } = usePackage();
  const { customerInfo, setCustomerInfo } = useCustomerInfo();
  const [showFullContract, setShowFullContract] = useState(false);
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    confirmPurchaseTitle: "Confirm Purchase",
    loadingContract: "Loading contract details...",
    cancelButton: "Cancel",
    confirmButton: "Confirm",
    enterName: "Please enter your name.",
    enterPhone: "Please enter your phone number.",
    enterAddress: "Please enter your address.",
    agreeToTerms: "You must agree to the terms before purchasing.",
    companyNameLabel: "Company Name",
    companyAddressLabel: "Company Address",
    businessNumberLabel: "Business Number",
    representativeLabel: "Representative",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("Confirm Purchase", language),
        translateText("Loading contract details...", language),
        translateText("Cancel", language),
        translateText("Confirm", language),
        translateText("Please enter your name.", language),
        translateText("Please enter your phone number.", language),
        translateText("Please enter your address.", language),
        translateText(
          "You must agree to the terms before purchasing.",
          language
        ),
        translateText("Company Name", language),
        translateText("Company Address", language),
        translateText("Business Number", language),
        translateText("Representative", language),
      ]);

      setTranslatedTexts({
        confirmPurchaseTitle: translations[0],
        loadingContract: translations[1],
        cancelButton: translations[2],
        confirmButton: translations[3],
        enterName: translations[4],
        enterPhone: translations[5],
        enterAddress: translations[6],
        agreeToTerms: translations[7],
        companyNameLabel: translations[8],
        companyAddressLabel: translations[9],
        businessNumberLabel: translations[10],
        representativeLabel: translations[11],
      });
    };

    fetchTranslations();
  }, [language]);

  const handleConfirmPurchase = () => {
    if (!customerInfo.name) {
      alert(translatedTexts.enterName);
      return;
    }
    if (!customerInfo.phone) {
      alert(translatedTexts.enterPhone);
      return;
    }
    if (!customerInfo.address) {
      alert(translatedTexts.enterAddress);
      return;
    }
    if (!customerInfo.agreed) {
      alert(translatedTexts.agreeToTerms);
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
              contractContents={defaultContract.content}
              closeModal={() => setShowFullContract(false)}
            />
          </div>
        )}

        {!showFullContract && defaultContract && (
          <div className="mt-0">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
              {translatedTexts.confirmPurchaseTitle}
            </h2>

            {defaultContract ? (
              <ContractInfo
                contractContent={defaultContract.content} // 배열의 첫 번째 단락만 전달
                showFullContract={showFullContract}
                setShowFullContract={setShowFullContract}
              />
            ) : (
              <p className="text-gray-300 mb-4 text-center">
                {translatedTexts.loadingContract}
              </p>
            )}

            <div className="p-4 bg-gray-800 rounded-lg border border-cyan-500 mb-4">
              <div className="mb-3">
                <label className="block text-gray-300 mb-1 text-sm">
                  {translatedTexts.companyNameLabel}
                </label>
                <p className="text-white text-sm">
                  {defaultContract.companyName}
                </p>
              </div>
              <div className="mb-3">
                <label className="block text-gray-300 mb-1 text-sm">
                  {translatedTexts.companyAddressLabel}
                </label>
                <p className="text-white text-sm">
                  {defaultContract.companyAddress}
                </p>
              </div>
              <div className="mb-3">
                <label className="block text-gray-300 mb-1 text-sm">
                  {translatedTexts.businessNumberLabel}
                </label>
                <p className="text-white text-sm">
                  {defaultContract.businessNumber}
                </p>
              </div>
              <div className="mb-3">
                <label className="block text-gray-300 mb-1 text-sm">
                  {translatedTexts.representativeLabel}
                </label>
                <p className="text-white text-sm">
                  {defaultContract.representative}
                </p>
              </div>
            </div>

            <CustomerInfoForm
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleContractClose}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg transition hover:bg-red-600"
              >
                {translatedTexts.cancelButton}
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-3 py-2 bg-cyan-500 text-white text-sm rounded-lg transition hover:bg-cyan-600"
              >
                {translatedTexts.confirmButton}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
