// src/app/dashboard/page.tsx

"use client";

import { useState } from "react";
import MainContent from "@/components/Main/MainContent";
import FooterNavigation from "@/components/Footer/FooterNavigation";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState("Home");

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      {/* Main Content Section */}
      <div className="flex-grow w-full max-w-4xl p-4 mx-auto bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* `pb-[80px]` ensures no overlap with FooterNavigation */}
        <MainContent activeScreen={activeScreen} />
      </div>

      {/* Footer Navigation Section */}
      <div className="fixed bottom-0 w-full max-w-4xl bg-gray-900/90 shadow-t-lg z-20 mx-auto">
        <FooterNavigation setActiveScreen={setActiveScreen} />
      </div>
    </div>
  );
}
