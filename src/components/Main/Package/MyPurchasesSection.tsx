// src/components/MyPurchasesSection.tsx

import React from "react";

interface MyPurchasesSectionProps {
  userPackages: any[];
  error: string | null;
}

export default function MyPurchasesSection({
  userPackages,
  error,
}: MyPurchasesSectionProps) {
  return (
    <div>
      <h2 className="text-4xl font-bold text-center text-cyan-400 mb-6 tracking-wide">
        My Purchases
      </h2>
      <div className="p-4 border rounded border-cyan-500 bg-gray-800">
        {error === "Wallet not found." && (
          <div className="bg-yellow-100 text-yellow-700 border border-yellow-600 px-4 py-3 rounded mb-4">
            Wallet not found. Please create a wallet.
          </div>
        )}
        {userPackages.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-300">
            {userPackages.map((record) => (
              <li key={record.packageType} className="mb-2">
                {record.packageType} mining - {record.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">No purchases yet.</p>
        )}
      </div>
    </div>
  );
}
