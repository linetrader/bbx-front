// src/app/dashboard/page.tsx

"use client";

import { useState } from "react";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import FooterNavigation from "@/components/FooterNavigation";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState("Home");

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MainContent activeScreen={activeScreen} />
      <FooterNavigation setActiveScreen={setActiveScreen} />
    </div>
  );
}
