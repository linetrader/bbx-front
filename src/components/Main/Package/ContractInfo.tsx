"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";
import { ContractInfoProps } from "@/types/Package";

const ContractInfo: React.FC<ContractInfoProps> = ({
  contractContent,
  isFullContractVisible,
  setIsFullContractVisible,
}) => {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    showMore: "더 보기",
    showLess: "접기",
    translatedContent: "",
  });

  const tempContract =
    contractContent.length > 1
      ? contractContent.slice(0, 3).join("")
      : contractContent[0] || "";

  const maxLength = 150;
  const beforeLength = tempContract.length;

  const displayedContent = isFullContractVisible
    ? tempContract
    : tempContract.slice(0, maxLength);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const keys = [
          { key: "showMore", text: "더 보기" },
          { key: "showLess", text: "접기" },
          { key: "translatedContent", text: displayedContent },
        ];

        const translations = await Promise.all(
          keys.map((item) => fetchTranslation(item.text, language))
        );

        const updatedTranslations = keys.reduce(
          (acc, item, index) => {
            acc[item.key as keyof typeof translatedTexts] = translations[index];
            return acc;
          },
          { ...translatedTexts }
        );

        setTranslatedTexts(updatedTranslations);
      } catch (error) {
        console.error("[ERROR] Failed to fetch translations:", error);
      }
    };

    fetchTranslations();
  }, [language, displayedContent]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-cyan-500 mb-6">
      <p className="text-gray-300 mb-4">
        {translatedTexts.translatedContent}
        {beforeLength > maxLength && (
          <button
            onClick={() => setIsFullContractVisible(!isFullContractVisible)}
            className="text-cyan-500 ml-2"
          >
            {isFullContractVisible
              ? translatedTexts.showLess
              : translatedTexts.showMore}
          </button>
        )}
      </p>
    </div>
  );
};

export default ContractInfo;
