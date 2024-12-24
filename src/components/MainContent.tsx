// components/MainContent.tsx

"use client";

import Home from "@/components/Home";
import Status from "@/components/Status";
import Swap from "@/components/Swap";
import Wallet from "@/components/Wallet";
import Profile from "@/components/Profile";

export default function MainContent({
  activeScreen,
}: {
  activeScreen: string;
}) {
  switch (activeScreen) {
    case "Home":
      return <Home />;
    case "Status":
      return <Status />;
    case "Swap":
      return <Swap />;
    case "Wallet":
      return <Wallet />;
    case "Profile":
      return <Profile />;
    default:
      return (
        <div className="text-center">
          <h2 className="text-4xl font-bold text-yellow-400 mb-4">Welcome</h2>
          <p className="text-lg text-gray-300">Your personalized dashboard</p>
        </div>
      );
  }
}
