// src/utils/i18n.ts

"use client"; // 클라이언트 전용

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// JSON 파일 가져오기
import enLogin from "../../public/locales/en/login.json";
import jpLogin from "../../public/locales/jp/login.json";
import krLogin from "../../public/locales/kr/login.json";

import enRegister from "../../public/locales/en/register.json";
import jpRegister from "../../public/locales/jp/register.json";
import krRegister from "../../public/locales/kr/register.json";

import enDashboard from "../../public/locales/en/dashboard.json";
import jpDashboard from "../../public/locales/jp/dashboard.json";
import krDashboard from "../../public/locales/kr/dashboard.json";

import enContractModal from "../../public/locales/en/contract.json";
import jpContractModal from "../../public/locales/jp/contract.json";
import krContractModal from "../../public/locales/kr/contract.json";

import enPackageBuySection from "../../public/locales/en/packageBuy.json";
import jpPackageBuySection from "../../public/locales/jp/packageBuy.json";
import krPackageBuySection from "../../public/locales/kr/packageBuy.json";

i18n.use(initReactI18next).init({
  debug: true, // 디버그 활성화
  resources: {
    en: {
      login: enLogin,
      register: enRegister,
      dashboard: enDashboard,
      contractModal: enContractModal,
      packageBuySection: enPackageBuySection,
    },
    jp: {
      login: jpLogin,
      register: jpRegister,
      dashboard: jpDashboard,
      contractModal: jpContractModal,
      packageBuySection: jpPackageBuySection,
    },
    kr: {
      login: krLogin,
      register: krRegister,
      dashboard: krDashboard,
      contractModal: krContractModal,
      packageBuySection: krPackageBuySection,
    },
  },
  lng: "kr", // 초기 언어 설정
  fallbackLng: "en", // 지원하지 않는 언어의 경우 기본 언어
  interpolation: {
    escapeValue: false, // React에서 XSS 보호를 위해 기본적으로 사용하지 않음
  },
});

export default i18n;
