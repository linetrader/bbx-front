// components/Package.tsx

import React, { useState } from "react";

export default function Package() {
  const [bbxQuantity, setBbxQuantity] = useState(0.001);
  const [btcQuantity, setBtcQuantity] = useState(0);
  const [dogeQuantity, setDogeQuantity] = useState(0);
  const bbxPrice = 0.001; // Example price for BBX Coin
  const btcMinerPrice = 400; // Price for BTC miner
  const dogeMinerPrice = 400; // Price for DOGE miner

  const total =
    bbxQuantity * bbxPrice +
    btcQuantity * btcMinerPrice +
    dogeQuantity * dogeMinerPrice;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="flex-grow flex items-start justify-center pt-24">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-4xl font-bold text-blue-400 mb-4">Package Buy</h2>
          <div className="my-6">
            <h3 className="text-xl text-white">BTC Mining</h3>
            <input
              type="number"
              value={btcQuantity}
              onChange={(e) => setBtcQuantity(parseFloat(e.target.value))}
              className="border p-2 mt-2 text-black"
            />
            <button className="bg-blue-500 text-black p-2 ml-2">BUY</button>
          </div>

          <div className="my-6">
            <h3 className="text-xl text-white">DOGE Mining</h3>
            <input
              type="number"
              value={dogeQuantity}
              onChange={(e) => setDogeQuantity(parseFloat(e.target.value))}
              className="border p-2 mt-2 text-black"
            />
            <button className="bg-blue-500 text-black p-2 ml-2">BUY</button>
          </div>

          <h3 className="text-2xl text-white mt-4">My USDT: 0.3 USDT</h3>

          <h3 className="text-2xl text-white mt-4">
            Total USDT: {total.toFixed(6)} USDT
          </h3>
        </div>
      </div>
    </div>
  );
}
