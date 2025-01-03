// src/app/(home)/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Root() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");

    if (!isAuthenticated) {
      router.push("/login"); // 로그인 페이지로 리디렉션
    } else {
      router.push("/dashboard"); // 대시보드로 리디렉션
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1>{t("loading")}</h1> {/* 로딩 메시지 번역 */}
    </div>
  );
}
