// src/components/ContractInfo.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

interface ContractInfoProps {
  contractContent: string[];
  showFullContract: boolean;
  setShowFullContract: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContractInfo: React.FC<ContractInfoProps> = ({
  contractContent,
  showFullContract,
  setShowFullContract,
}) => {
  const { language } = useTranslationContext();

  const [translatedTexts, setTranslatedTexts] = useState({
    showMore: "Show more",
    showLess: "Show less",
    translatedContent: "",
  });

  const tempContract =
    contractContent.length > 1
      ? String(contractContent[0]) +
        String(contractContent[1]) +
        String(contractContent[2])
      : String(contractContent[0] || "");

  const maxLength = 150;
  const beforeLength = tempContract.length;

  const displayedContent = showFullContract
    ? tempContract
    : tempContract.slice(0, maxLength);

  useEffect(() => {
    const fetchTranslations = async () => {
      const translations = await Promise.all([
        translateText("Show more", language),
        translateText("Show less", language),
        translateText(displayedContent, language),
      ]);

      setTranslatedTexts({
        showMore: translations[0],
        showLess: translations[1],
        translatedContent: translations[2],
      });
    };

    fetchTranslations();
  }, [language]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-cyan-500 mb-6">
      <p className="text-gray-300 mb-4">
        {translatedTexts.translatedContent}
        {beforeLength > maxLength && (
          <button
            onClick={() => setShowFullContract(!showFullContract)}
            className="text-cyan-500 ml-2"
          >
            {showFullContract
              ? translatedTexts.showLess
              : translatedTexts.showMore}
          </button>
        )}
      </p>
    </div>
  );
};

export default ContractInfo;
