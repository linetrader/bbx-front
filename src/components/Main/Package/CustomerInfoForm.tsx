"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";
import { CustomerInfoProps } from "@/types/Package";

const CustomerInfoForm: React.FC<CustomerInfoProps> = ({
  customerInfo,
  setCustomerInfo,
}) => {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    nameLabel: "이름",
    phoneLabel: "전화번호",
    addressLabel: "주소",
    termsLabel: "약관에 동의합니다.",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "nameLabel", text: "이름" },
          { key: "phoneLabel", text: "전화번호" },
          { key: "addressLabel", text: "주소" },
          { key: "termsLabel", text: "약관에 동의합니다." },
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

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-cyan-500 mb-6">
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          {translatedTexts.nameLabel}
        </label>
        <input
          type="text"
          value={customerInfo.name}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, name: e.target.value })
          }
          className="w-full px-4 py-2 border rounded bg-gray-700 text-white placeholder-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          {translatedTexts.phoneLabel}
        </label>
        <input
          type="text"
          value={customerInfo.phone}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, phone: e.target.value })
          }
          className="w-full px-4 py-2 border rounded bg-gray-700 text-white placeholder-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          {translatedTexts.addressLabel}
        </label>
        <input
          type="text"
          value={customerInfo.address}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, address: e.target.value })
          }
          className="w-full px-4 py-2 border rounded bg-gray-700 text-white placeholder-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center text-gray-300">
          <input
            type="checkbox"
            checked={customerInfo.agreed}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, agreed: e.target.checked })
            }
            className="mr-2"
          />
          {translatedTexts.termsLabel}
        </label>
      </div>
    </div>
  );
};

export default CustomerInfoForm;
