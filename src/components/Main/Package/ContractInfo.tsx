// src/components/ContractInfo.tsx
//import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { translateText } from "../../../utils/translate";

interface ContractInfoProps {
  contractContent: string;
  showFullContract: boolean;
  setShowFullContract: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContractInfo: React.FC<ContractInfoProps> = ({
  contractContent,
  showFullContract,
  setShowFullContract,
}) => {
  //const { t } = useTranslation();
  const maxLength = 300;
  const beforeLength = contractContent.length;

  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTranslation = async () => {
      setLoading(true);
      try {
        const translated = await translateText(contractContent, "ko");
        //console.log("Translation translated:", translated);
        setTranslatedContent(translated);
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedContent(contractContent); // 번역 실패 시 원문 사용
      } finally {
        setLoading(false);
      }
    };

    fetchTranslation();
  }, [contractContent]);

  const displayedContent = showFullContract
    ? translatedContent
    : translatedContent.slice(0, maxLength);

  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-cyan-500 mb-6">
      <p className="text-gray-300 mb-4">
        {displayedContent}
        {beforeLength > maxLength && (
          <button
            onClick={() => setShowFullContract(!showFullContract)}
            className="text-cyan-500 ml-2"
          >
            {showFullContract ? "showLess" : "showMore"}
          </button>
        )}
      </p>
    </div>
  );
};

export default ContractInfo;
