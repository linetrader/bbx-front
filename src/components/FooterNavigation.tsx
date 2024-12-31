// components/FooterNavigation.tsx

"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartPie,
  faWallet,
  faArrowsRotate,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

interface FooterNavigationProps {
  setActiveScreen: (screen: string) => void;
}

// 네비게이션 항목 데이터 배열
const navigationItems = [
  { screen: "Home", icon: faHome, label: "Dashboard" },
  { screen: "Package", icon: faChartPie, label: "Package" },
  { screen: "Wallet", icon: faWallet, label: "Wallet" },
  { screen: "Transaction", icon: faArrowsRotate, label: "Transaction" },
  { screen: "Profile", icon: faUser, label: "Profile" },
];

export default function FooterNavigation({
  setActiveScreen,
}: FooterNavigationProps) {
  const [activeScreen, setLocalActiveScreen] = useState<string>("Home");

  // 버튼 클릭 시 화면 전환 처리
  const handleButtonClick = (screen: string) => {
    setLocalActiveScreen(screen);
    setActiveScreen(screen);
  };

  // 버튼의 동적 스타일 정의
  const buttonClass = (screen: string) =>
    `w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-transform duration-300 ${
      activeScreen === screen
        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black scale-110"
        : "bg-gray-800 text-cyan-400 hover:bg-gray-700 hover:text-cyan-300"
    }`;

  // 텍스트의 동적 스타일 정의
  const textClass = (screen: string) =>
    `mt-1 text-xs font-semibold ${
      activeScreen === screen
        ? "text-cyan-300"
        : "text-cyan-400 hover:text-cyan-300"
    }`;

  return (
    <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[85%] max-w-md bg-gray-900/90 shadow-2xl rounded-t-lg border-t border-cyan-500">
      <div className="flex justify-around items-center py-3">
        {navigationItems.map(({ screen, icon, label }) => (
          <button
            key={screen}
            className="flex flex-col items-center justify-center transition duration-300"
            onClick={() => handleButtonClick(screen)}
          >
            <span className={buttonClass(screen)}>
              <FontAwesomeIcon icon={icon} size="lg" />
            </span>
            <span className={textClass(screen)}>{label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}
