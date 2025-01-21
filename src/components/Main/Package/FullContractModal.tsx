// src/components/FullContractModal.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { fetchTranslation } from "@/utils/TranslateModule/translateCache";
import { FullContractModalProps } from "@/types/Package";

const FullContractModal: React.FC<FullContractModalProps> = ({
  contractContents,
  closeModal,
}) => {
  const { language } = useTranslationContext();
  const [translatedTexts, setTranslatedTexts] = useState({
    fullContractTitle: contractContents[0] || "전체 계약", // 첫 번째 단락을 제목으로 설정
    closeButton: "닫기",
    translatedContents: contractContents.slice(1), // 나머지 단락들만 내용으로 설정
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const translatedContents = await Promise.all(
          contractContents
            .slice(1)
            .map((content) => fetchTranslation(content, language))
        );
        const [translatedTitle, translatedCloseButton] = await Promise.all([
          fetchTranslation(contractContents[0] || "전체 계약", language),
          fetchTranslation("닫기", language),
        ]);

        setTranslatedTexts({
          fullContractTitle: translatedTitle,
          closeButton: translatedCloseButton,
          translatedContents,
        });
      } catch (error) {
        console.error("[ERROR] Failed to fetch translations:", error);
      }
    };

    fetchTranslations();
  }, [language, contractContents]);

  return (
    <div className="flex bg-black bg-opacity-50 items-center justify-center z-50">
      <div className="w-[90%] max-w-lg bg-gray-900 p-6 rounded-lg border border-cyan-500 shadow-xl relative">
        <header>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-red-500 text-2xl"
            title={translatedTexts.closeButton}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
            {translatedTexts.fullContractTitle}
          </h2>
        </header>
        <main>
          <div
            className="text-gray-300 text-left"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {translatedTexts.translatedContents.map((paragraph, index) => (
              <p key={index} className="mb-2">
                {paragraph}
              </p>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FullContractModal;
