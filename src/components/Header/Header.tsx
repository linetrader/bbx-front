// components/Header/Header.tsx

"use client";

import Image from "next/image";
import Select from "react-select";
import Flag from "react-world-flags";
import Logo from "../../assets/images/logos/logo.png";
import { useHeader } from "@/hooks/useHeader";

export default function Header() {
  const {
    isMenuOpen,
    setIsMenuOpen,
    handleLanguageChange,
    handleMenuClick,
    options,
    isLoggedIn,
  } = useHeader();

  return (
    <div className="flex justify-between items-center p-2 bg-gray-900 shadow-md text-white relative">
      {/* Logo */}
      <div style={{ width: "100px", position: "relative" }}>
        <Image src={Logo} alt="BitBoostX Logo" />
      </div>

      {/* Right Section: Language Selector and Menu */}
      <div className="flex items-center">
        {/* Language Selector */}
        <div
          className="absolute"
          style={{ top: "13px", right: "80px", height: "30px" }}
        >
          <Select
            instanceId="language-select"
            options={options}
            defaultValue={options.find((option) => option.value === "ko")}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "#4B5563",
                borderRadius: "0.375rem",
                borderColor: "#4B5563",
                minHeight: "35px",
                height: "35px",
                padding: "0px",
              }),
              option: (provided) => ({
                ...provided,
                backgroundColor: "#6B7280",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "white",
              }),
            }}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            formatOptionLabel={(data) => (
              <div className="flex items-center">
                <Flag code={data.flag} className="inline-block w-6 h-4 mr-2" />
                {data.label}
              </div>
            )}
            onChange={handleLanguageChange}
          />
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            className="p-1 rounded focus:outline-none bg-gray-700 hover:bg-gray-600"
            style={{ width: "60px", height: "35px", padding: "0" }}
            onClick={() => setIsMenuOpen((prev) => !prev)} // 메뉴 열림/닫힘 토글
          >
            {/* SVG 아이콘 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="8 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-full h-full text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h32M4 12h32M4 18h32"
              />
            </svg>
          </button>
          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg w-48 text-black z-30">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleMenuClick("notice")}
              >
                Notice
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleMenuClick("tree")}
              >
                Tree
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleMenuClick("wallet")}
              >
                Wallet
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleMenuClick("auth")}
              >
                {isLoggedIn ? "Logout" : "Login"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
