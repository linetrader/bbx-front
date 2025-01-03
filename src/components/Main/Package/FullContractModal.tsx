// src/components/FullContractModal.tsx
import React from "react";

interface FullContractModalProps {
  contractContent: string;
  closeModal: () => void;
}

const FullContractModal: React.FC<FullContractModalProps> = ({
  contractContent,
  closeModal,
}) => {
  return (
    <div className="frex bg-gray-900 p-6 rounded-lg relative">
      <header>
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-red-500 text-3xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
          Full Contract
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
            //overflowY: "scroll", // 세로 스크롤만 활성화
            //height: "calc(66vh - 80px)", // 높이를 화면의 2/3로 줄임
          }}
        >
          {contractContent}
        </div>
      </main>
    </div>
  );
};

export default FullContractModal;
