// src/app/(home)/page.tsx

"use client";

import { redirect } from "next/navigation";

export default function Root() {
  redirect("/login"); // 로그인 페이지로 리디렉션
  return null; // 리턴 값 없음
}
