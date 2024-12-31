// src/hooks/useDashboard.ts

import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

interface MiningData {
  btcMined: number;
  dogeMined: number;
}

interface ReferralRewards {
  btcReferral: number;
  dogeReferral: number;
  usdtReferral: number;
}

export function useDashboard() {
  const { graphqlRequest, loading, error, setError, resetError } = useGraphQL();
  const [miningData, setMiningData] = useState<MiningData | null>(null);
  const [referralRewards, setReferralRewards] =
    useState<ReferralRewards | null>(null);

  const fetchMiningData = async () => {
    resetError();
    try {
      const { data: userMiningData } = await graphqlRequest(
        `
            query {
              getUserMiningData {
                packageType
                miningBalance
              }
            }
          `
      );

      // 타입별 데이터 매핑
      const miningData: MiningData = userMiningData.getUserMiningData.reduce(
        (
          acc: MiningData,
          item: { packageType: string; miningBalance: number }
        ) => {
          const formattedBalance = parseFloat(
            item.miningBalance.toFixed(6) // 소수점 6자리로 자르기
          );
          if (item.packageType === "BTC") acc.btcMined = formattedBalance;
          if (item.packageType === "DOGE") acc.dogeMined = formattedBalance;
          return acc;
        },
        { btcMined: 0, dogeMined: 0 }
      );

      setMiningData(miningData);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setMiningData(null);
    }
  };

  useEffect(() => {
    fetchMiningData();
  }, []);

  return { miningData, referralRewards, loading, error };
}
