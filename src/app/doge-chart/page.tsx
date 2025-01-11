"use client";

import React, { useEffect } from "react";

const DogeChartPage: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      new TradingView.widget({
        container_id: "tradingview_doge_chart",
        autosize: true,
        symbol: "BINANCE:DOGEUSDT",
        interval: "30",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        studies: ["RSI@tv-basicstudies"],
      });
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-2xl text-cyan-400 mb-4">DOGE Chart</h1>
      <div
        id="tradingview_doge_chart"
        style={{ width: "100%", height: "500px" }}
      ></div>
    </div>
  );
};

export default DogeChartPage;
