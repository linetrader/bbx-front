// src/components/FullContractModal.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useTranslationContext } from "@/context/TranslationContext";
import { translateText } from "@/utils/translate";

interface FullContractModalProps {
  contractContents: string[]; // 단락들을 배열로 관리
  closeModal: () => void;
}

const FullContractModal: React.FC<FullContractModalProps> = ({
  contractContents,
  closeModal,
}) => {
  const { language } = useTranslationContext();
  const [translatedTexts, setTranslatedTexts] = useState({
    fullContractTitle: contractContents[0] || "Full Contract", // 첫 번째 단락을 제목으로 설정
    closeButton: "Close",
    translatedContents: contractContents.slice(1), // 나머지 단락들만 내용으로 설정
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      const translatedContents = await Promise.all(
        contractContents
          .slice(1)
          .map((content) => translateText(content, language))
      );
      const [translatedTitle, translatedCloseButton] = await Promise.all([
        translateText(contractContents[0] || "Full Contract", language),
        translateText("Close", language),
      ]);

      setTranslatedTexts({
        fullContractTitle: translatedTitle,
        closeButton: translatedCloseButton,
        translatedContents,
      });
    };

    fetchTranslations();
  }, [language, contractContents]);

  return (
    <div className="frex bg-gray-900 p-6 rounded-lg relative">
      <header>
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-red-500 text-3xl"
          title={translatedTexts.closeButton} // Button tooltip
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
          {translatedTexts.fullContractTitle}
        </h2>
      </header>
      <main>
        <div
          className="frex text-gray-300 text-left"
          style={{
            paddingLeft: "0", // 텍스트 왼쪽 여백을 없앰
            whiteSpace: "pre-wrap", // 줄 바꿈 유지
            wordWrap: "break-word", // 긴 단어는 자동으로 줄 바꿈
            overflowX: "hidden", // 가로 스크롤 방지
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
  );
};

export default FullContractModal;
