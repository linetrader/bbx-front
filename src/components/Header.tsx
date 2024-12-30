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
        <div className="absolute -top-16 -left-6 w-40 h-16">
          {" "}
          {/* 로고 크기 조정 */}
          <Image
            src={Logo}
            alt="BitBoostX Logo"
            layout="responsive" // 이미지 비율 유지
            width={160} // 로고 너비
            height={64} // 로고 높이
          />
        </div>
      </div>

      {/* 햄버거 메뉴 버튼 */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-6 right-6 p-2 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none"
      >
        <div className="w-8 h-1 bg-gray-400 mb-1"></div>
        <div className="w-8 h-1 bg-gray-400 mb-1"></div>
        <div className="w-8 h-1 bg-gray-400"></div>
      </button>

      {/* 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="absolute top-14 right-6 bg-gray-800 shadow-lg rounded-lg w-48 z-50">
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
