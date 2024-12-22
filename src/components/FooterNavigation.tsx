// components/FooterNavigation.tsx

"use client";

interface FooterNavigationProps {
  handleProfileClick: () => void;
  setActiveScreen: (screen: string) => void;
}

export default function FooterNavigation({
  handleProfileClick,
  setActiveScreen,
}: FooterNavigationProps) {
  return (
    <footer className="flex justify-around bg-gray-900 p-4 shadow-lg mt-auto">
      <button
        className="flex-1 mx-2 bg-gray-700 py-3 rounded-lg text-yellow-400 font-semibold hover:bg-gray-600 flex items-center justify-center"
        style={{ aspectRatio: "1 / 1" }}
        onClick={() => setActiveScreen("Home")}
      >
        Home
      </button>
      <button
        className="flex-1 mx-2 bg-gray-700 py-3 rounded-lg text-yellow-400 font-semibold hover:bg-gray-600 flex items-center justify-center"
        style={{ aspectRatio: "1 / 1" }}
        onClick={() => setActiveScreen("Status")}
      >
        Status
      </button>
      <button
        className="flex-1 mx-2 bg-gray-700 py-3 rounded-lg text-yellow-400 font-semibold hover:bg-gray-600 flex items-center justify-center"
        style={{ aspectRatio: "1 / 1" }}
        onClick={() => setActiveScreen("Swap")}
      >
        Swap
      </button>
      <button
        className="flex-1 mx-2 bg-gray-700 py-3 rounded-lg text-yellow-400 font-semibold hover:bg-gray-600 flex items-center justify-center"
        style={{ aspectRatio: "1 / 1" }}
        onClick={() => setActiveScreen("Wallet")}
      >
        Wallet
      </button>
      <button
        className="flex-1 mx-2 bg-gray-700 py-3 rounded-lg text-yellow-400 font-semibold hover:bg-gray-600 flex items-center justify-center"
        style={{ aspectRatio: "1 / 1" }}
        onClick={handleProfileClick}
      >
        Profile
      </button>
    </footer>
  );
}
