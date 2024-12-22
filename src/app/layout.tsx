// src/app/layout.tsx
import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.css";

export const metadata = {
  title: "BoostX",
  description: "Next.js + Nest.js Fullstack Application",
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
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
