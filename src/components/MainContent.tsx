// components/MainContent.tsx

"use client";

import Package from "@/components/Package";
import Wallet from "@/components/wallet/Wallet";
import Transaction from "@/components/Transaction";
import Profile from "@/components/Profile";
import Dashboard from "@/components/Dashboard";

export default function MainContent({
  activeScreen,
}: {
  activeScreen: string;
}) {
  switch (activeScreen) {
    case "Home":
      return <Dashboard />;
    case "Package":
      return <Package />;
    case "Wallet":
      return <Wallet />;
    case "Transaction":
      return <Transaction />;
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
