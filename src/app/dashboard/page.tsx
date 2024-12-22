// src/app/dashboard/page.tsx

"use client";

import { useState } from "react";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";
import FooterNavigation from "@/components/FooterNavigation";
import api from "../../utils/api";

interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState("Home");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/graphql", {
        query: `
          query {
            me {
              username
              email
              firstname
              lastname
            }
          }
        `,
      });
      setUserData(data.data.me);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    fetchProfileData();
    setActiveScreen("Profile");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MainContent
        activeScreen={activeScreen}
        userData={userData}
        loading={loading}
      />
      <FooterNavigation
        handleProfileClick={handleProfileClick}
        setActiveScreen={setActiveScreen}
      />
    </div>
  );
}
