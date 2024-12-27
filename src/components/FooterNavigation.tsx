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

export default function FooterNavigation({
  setActiveScreen,
}: FooterNavigationProps) {
  const [activeScreen, setLocalActiveScreen] = useState<string>("Home");

  const handleButtonClick = (screen: string) => {
    setLocalActiveScreen(screen);
    setActiveScreen(screen);
  };

  const buttonClass = (screen: string) =>
    activeScreen === screen
      ? "w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-300 text-gray-900 rounded-full hover:from-blue-500 hover:to-blue-400"
      : "w-16 h-16 flex items-center justify-center bg-gray-900 text-blue-400 rounded-full";

  const textClass = (screen: string) =>
    activeScreen === screen
      ? "mt-2 text-sm font-semibold text-blue-300"
      : "mt-2 text-sm font-semibold text-blue-400 hover:text-blue-300";

  return (
    <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-gray-900 shadow-lg">
      <div className="flex justify-around items-center p-4 space-x-4">
        <button
          className="flex flex-col items-center justify-center transition duration-200"
          onClick={() => handleButtonClick("Home")}
        >
          <span className={buttonClass("Home")}>
            <FontAwesomeIcon icon={faHome} size="2x" />
          </span>
          <span className={textClass("Home")}>Dashboard</span>
        </button>
        <button
          className="flex flex-col items-center justify-center transition duration-200"
          onClick={() => handleButtonClick("Package")}
        >
          <span className={buttonClass("Package")}>
            <FontAwesomeIcon icon={faChartPie} size="2x" />
          </span>
          <span className={textClass("Package")}>Package</span>
        </button>
        <button
          className="flex flex-col items-center justify-center transition duration-200"
          onClick={() => handleButtonClick("Wallet")}
        >
          <span className={buttonClass("Wallet")}>
            <FontAwesomeIcon icon={faWallet} size="2x" />
          </span>
          <span className={textClass("Wallet")}>Wallet</span>
        </button>
        <button
          className="flex flex-col items-center justify-center transition duration-200"
          onClick={() => handleButtonClick("Transaction")}
        >
          <span className={buttonClass("Transaction")}>
            <FontAwesomeIcon icon={faArrowsRotate} size="2x" />
          </span>
          <span className={textClass("Transaction")}>Transaction</span>
        </button>
        <button
          className="flex flex-col items-center justify-center transition duration-200"
          onClick={() => handleButtonClick("Profile")}
        >
          <span className={buttonClass("Profile")}>
            <FontAwesomeIcon icon={faUser} size="2x" />
          </span>
          <span className={textClass("Profile")}>Profile</span>
        </button>
      </div>
    </footer>
  );
}
