// src/app/layout.tsx

import Header from "@/components/Header/Header";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TranslationProvider } from "@/context/TranslationContext";
import { ToastContainer } from "react-toastify"; // ToastContainer import
import "react-toastify/dist/ReactToastify.css"; // Toastify 스타일 가져오기

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
        <div className="relative bg-white overflow-hidden aspect-9-16">
          <AuthProvider>
            <TranslationProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <ToastContainer
                position="top-right" // 알림 위치
                autoClose={3000} // 자동 닫힘 시간 (밀리초)
                hideProgressBar={false} // 진행 바 표시 여부
                newestOnTop={false} // 최신 알림을 위에 표시
                closeOnClick // 클릭 시 알림 닫힘
                rtl={false} // 오른쪽에서 왼쪽 방향 (false로 설정)
                pauseOnFocusLoss // 포커스 잃을 때 일시정지
                draggable // 드래그 가능 여부
                pauseOnHover // 마우스 올릴 때 일시정지
                theme="colored" // 테마 (light, dark, colored 중 선택 가능)
              />
            </TranslationProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
