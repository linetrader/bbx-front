// components/Header.tsx

"use client";

import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import Logo from "../assets/images/logos/LOGO.png"; // 로고 이미지 파일 경로

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}

export default function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="p-6 flex justify-between items-center bg-gray-900 shadow-lg relative">
      {/* 로고 이미지 */}
      <div className="relative w-20 h-8">
        <div className="relative -top-20 -left-20 w-80 h-48 max-w-none max-h-none">
          <Image
            src={Logo}
            alt="BitBoostX Logo"
            layout="fill"
            sizes="(max-width: 768px) 100vw, 50vw"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="relative">
        {/* 햄버거 메뉴 버튼 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none"
        >
          <div className="w-8 h-1 bg-white mb-1"></div>
          <div className="w-8 h-1 bg-white mb-1"></div>
          <div className="w-8 h-1 bg-white"></div>
        </button>
        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="absolute top-14 right-0 bg-gray-800 shadow-lg rounded-lg w-48 z-50">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
