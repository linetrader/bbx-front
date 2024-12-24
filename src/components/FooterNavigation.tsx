// components/FooterNavigation.tsx

"use client";

interface FooterNavigationProps {
  setActiveScreen: (screen: string) => void;
}

export default function FooterNavigation({
  setActiveScreen,
}: FooterNavigationProps) {
  return (
    <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-gray-900 shadow-lg">
      <div className="flex justify-around items-center p-4 space-x-4">
        <button
          className="flex flex-col items-center justify-center text-yellow-400 hover:text-yellow-300 transition duration-200"
          onClick={() => setActiveScreen("Home")}
        >
          <span className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700">
            🏠
          </span>
          <span className="mt-2 text-sm font-semibold">Home</span>
        </button>
        <button
          className="flex flex-col items-center justify-center text-yellow-400 hover:text-yellow-300 transition duration-200"
          onClick={() => setActiveScreen("Status")}
        >
          <span className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700">
            📊
          </span>
          <span className="mt-2 text-sm font-semibold">Status</span>
        </button>
        <button
          className="flex flex-col items-center justify-center text-yellow-400 hover:text-yellow-300 transition duration-200"
          onClick={() => setActiveScreen("Swap")}
        >
          <span className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700">
            🔄
          </span>
          <span className="mt-2 text-sm font-semibold">Swap</span>
        </button>
        <button
          className="flex flex-col items-center justify-center text-yellow-400 hover:text-yellow-300 transition duration-200"
          onClick={() => setActiveScreen("Wallet")}
        >
          <span className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700">
            💳
          </span>
          <span className="mt-2 text-sm font-semibold">Wallet</span>
        </button>
        <button
          className="flex flex-col items-center justify-center text-yellow-400 hover:text-yellow-300 transition duration-200"
          onClick={() => setActiveScreen("Profile")}
        >
          <span className="w-16 h-16 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700">
            👤
          </span>
          <span className="mt-2 text-sm font-semibold">Profile</span>
        </button>
      </div>
    </footer>
  );
}
