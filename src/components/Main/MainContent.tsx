// components/MainContent.tsx

"use client";

import Package from "@/components/Main/Package/Package";
import Wallet from "@/components/Main/wallet/Wallet";
import Transaction from "@/components/Main/Transaction/Transaction";
import Profile from "@/components/Main/Profile/Profile";
import Dashboard from "@/components/Main/Dashboard/Dashboard";

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
