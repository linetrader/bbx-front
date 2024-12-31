// components/MainContent.tsx

"use client";

import Package from "@/components/Package";
import Wallet from "@/components/wallet/Wallet";
import Transaction from "@/components/Transaction";
import Profile from "@/components/Profile";
import Dashboard from "@/components/Dashboard";

const contentStyle =
  "h-full overflow-y-auto scrollbar-hide max-h-[calc(100vh-160px)] -mt-8";

export default function MainContent({
  activeScreen,
}: {
  activeScreen: string;
}) {
  switch (activeScreen) {
    case "Home":
      return (
        <div className={contentStyle}>
          <Dashboard />
        </div>
      );

    case "Package":
      return (
        <div className={contentStyle}>
          <Package />
        </div>
      );

    case "Wallet":
      return (
        <div className={contentStyle}>
          <Wallet />
        </div>
      );

    case "Transaction":
      return (
        <div className={contentStyle}>
          <Transaction />
        </div>
      );

    case "Profile":
      return (
        <div className={contentStyle}>
          <Profile />
        </div>
      );
  }
}
