// next.config.ts

import { NextConfig } from "next";
import nextI18NextConfig from "./next-i18next.config";

const nextConfig: NextConfig = {
  reactStrictMode: true, // React Strict Mode 활성화
  i18n: nextI18NextConfig.i18n, // next-i18next의 i18n 설정 통합
};

export default nextConfig;
