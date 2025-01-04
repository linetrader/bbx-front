// src/components/CustomerInfoForm.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

interface CustomerInfoProps {
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    agreed: boolean;
  };
  setCustomerInfo: React.Dispatch<React.SetStateAction<any>>;
}

const CustomerInfoForm: React.FC<CustomerInfoProps> = ({
  customerInfo,
  setCustomerInfo,
}) => {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    nameLabel: "Name",
    phoneLabel: "Phone",
    addressLabel: "Address",
    termsLabel: "I agree to the terms and conditions.",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("Name", language),
        translateText("Phone", language),
        translateText("Address", language),
        translateText("I agree to the terms and conditions.", language),
      ]);

      setTranslatedTexts({
        nameLabel: translations[0],
        phoneLabel: translations[1],
        addressLabel: translations[2],
        termsLabel: translations[3],
      });
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
