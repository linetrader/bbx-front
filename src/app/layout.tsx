// src/app/layout.tsx

import { TranslationProvider } from "@/components/TranslationProvider";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "BitBoostX",
  description: "Best Mining Group",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex items-center justify-center min-h-screen bg-gray-800">
        {/* 9:16 비율을 위한 컨테이너 */}
        <div
          className="relative bg-white overflow-hidden"
          style={{
            width: "calc(100vh * 9 / 16)", // 9:16 비율로 고정
            height: "100vh",
            maxWidth: "100%", // 최대 화면 너비를 초과하지 않도록 제한
          }}
        >
          <AuthProvider>
            <TranslationProvider>{children}</TranslationProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
