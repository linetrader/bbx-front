// src/components/ContractModal.tsx

"use client";

import React, { useEffect, useState } from "react";
import { usePackage } from "../../../hooks/usePackage";
import CustomerInfoForm from "./CustomerInfoForm";
import ContractInfo from "./ContractInfo";
import FullContractModal from "./FullContractModal";
import useCustomerInfo from "../../../hooks/useCustomerInfo";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";

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
    confirmPurchaseTitle: "구매 확인",
    loadingContract: "계약 세부 정보를 로드 중...",
    cancelButton: "취소",
    confirmButton: "확인",
    enterName: "이름을 입력하세요.",
    enterPhone: "전화번호를 입력하세요.",
    enterAddress: "주소를 입력하세요.",
    agreeToTerms: "구매 전에 약관에 동의해야 합니다.",
    companyNameLabel: "회사 이름",
    companyAddressLabel: "회사 주소",
    businessNumberLabel: "사업자 번호",
    representativeLabel: "대표자",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "confirmPurchaseTitle", text: "구매 확인" },
          { key: "loadingContract", text: "계약 세부 정보를 로드 중..." },
          { key: "cancelButton", text: "취소" },
          { key: "confirmButton", text: "확인" },
          { key: "enterName", text: "이름을 입력하세요." },
          { key: "enterPhone", text: "전화번호를 입력하세요." },
          { key: "enterAddress", text: "주소를 입력하세요." },
          {
            key: "agreeToTerms",
            text: "구매 전에 약관에 동의해야 합니다.",
          },
          { key: "companyNameLabel", text: "회사 이름" },
          { key: "companyAddressLabel", text: "회사 주소" },
          { key: "businessNumberLabel", text: "사업자 번호" },
          { key: "representativeLabel", text: "대표자" },
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
                contractContent={defaultContract.content}
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
