// next-i18next.config.ts

import path from "path";
import type { UserConfig } from "next-i18next";

const nextI18NextConfig: UserConfig = {
  i18n: {
    locales: ["en", "kr", "jp", "cn"], // 지원하는 언어 목록
    defaultLocale: "kr", // 기본 언어
    localeDetection: false, // 클라이언트 언어 자동 감지 활성화
  },
  localePath: path.resolve("./public/locales"), // 언어 리소스 경로
  localeStructure: "{{lng}}/{{ns}}", // 언어 및 네임스페이스 구조
  localeExtension: "json", // 번역 파일 확장자
  fallbackLng: "en", // 지원되지 않는 언어 요청 시 기본 언어
  debug: true, // 디버그 활성화
};

export default nextI18NextConfig;
