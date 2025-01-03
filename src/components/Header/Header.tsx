// components/Header.tsx

"use client";

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import Logo from "../../assets/images/logos/LOGO.png"; // 로고 이미지 파일 경로
import Select from "react-select";
import Flag from "react-world-flags"; // react-world-flags 임포트
import i18n from "@/utils/i18n"; // i18n 가져오기
import { useTranslation } from "react-i18next"; // 수정: react-i18next로 변경
import { useRouter } from "next/navigation"; // 페이지 라우팅을 위한 useRouter 훅

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  setActiveScreen: (screen: string) => void;
}

// 국가 옵션
const options = [
  { label: "USA", flag: "US", value: "en" },
  { label: "KOR", flag: "KR", value: "kr" },
  { label: "JPA", flag: "JP", value: "jp" },
  { label: "CHN", flag: "CN", value: "cn" },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#4B5563", // 배경색을 회색으로 설정
    borderRadius: "0.375rem", // 기본적인 border-radius
    borderColor: "#4B5563", // 경계선 색상
    width: "80px", // 컨트롤 너비 줄이기
    height: "36px", // 컨트롤 높이 줄이기
  }),
  option: (provided: any) => ({
    ...provided,
    backgroundColor: "#6B7280", // 옵션 항목 배경색 설정
    color: "black", // 옵션 텍스트 색상 설정
    height: "30px", // 옵션 높이 줄이기
    ":hover": {
      backgroundColor: "#4B5563", // hover 시 배경색 변경
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#4B5563", // 선택된 값의 색상 설정
  }),
  indicatorSeparator: () => ({
    display: "none", // 화살표 왼쪽 구분선 숨기기
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    display: "none", // 드롭다운 화살표 아이콘 숨기기
  }),
};

export default function Header({
  menuOpen,
  setMenuOpen,
  setActiveScreen,
}: HeaderProps) {
  const { logout } = useAuth();
  const { t } = useTranslation(); // useTranslation 훅 사용
  const router = useRouter();

  // 디폴트 언어 설정
  useEffect(() => {
    const defaultLang = "kr";
    i18n.changeLanguage(defaultLang); // 디폴트 언어 설정
  }, []);

  // 로고 클릭 시 Dashboard 페이지로 이동
  const handleLogoClick = () => {
    setActiveScreen("Home");
  };

  // 언어 변경 처리
  const handleLanguageChange = (selectedOption: any) => {
    const { value } = selectedOption;
    console.log("i18n instance:", i18n);
    i18n.changeLanguage(value); // 언어 변경
    //router.push("/" + value); // URL을 리디렉션하여 페이지를 새로 고침
  };

  return (
    <div className="flex justify-between p-5">
      <div
        className="relative w-20 h-8 cursor-pointer"
        onClick={handleLogoClick}
      >
        {/* 로고 이미지 */}
        <div className="absolute -top-16 -left-6 w-40 h-16">
          <Image
            src={Logo}
            alt="BitBoostX Logo"
            layout="responsive"
            width={160}
            height={64}
          />
        </div>
      </div>

      <div className="absolute top-6 right-20">
        {/* 국가 선택 메뉴 */}
        <Select
          options={options}
          defaultValue={options.find((option) => option.value === "kr")} // 디폴트 선택 설정
          styles={customStyles} // 커스텀 스타일 적용
          formatOptionLabel={(data: any) => (
            <div className="flex items-center">
              <Flag code={data.flag} className="inline-block w-6 h-4 mr-2" />
              {data.label}
            </div>
          )}
          onChange={handleLanguageChange} // 언어 변경 처리
        />
      </div>

      <div>
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
      </div>
    </div>
  );
}
