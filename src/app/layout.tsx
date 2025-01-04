// src/app/layout.tsx

import Header from "@/components/Header/Header";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TranslationProvider } from "@/context/TranslationContext";

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
            </TranslationProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
