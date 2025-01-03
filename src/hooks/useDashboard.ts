// src/hooks/useDashboard.ts

import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

interface MiningData {
  packageType: string;
  miningBalance: number;
}

interface ReferralReward {
  packageType: string;
  referralBalance: number;
}

export function useDashboard() {
  const { graphqlRequest, loading, error, setError, resetError } = useGraphQL();
  const [miningData, setMiningData] = useState<MiningData[] | null>(null);
  const [referralRewards, setReferralRewards] = useState<
    ReferralReward[] | null
  >(null);

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

      const miningData: MiningData[] = userMiningData.getUserMiningData.map(
        (item: { packageType: string; miningBalance: number }) => ({
          packageType: item.packageType,
          miningBalance: parseFloat(item.miningBalance.toFixed(6)), // 소수점 6자리로 자르기
        })
      );

      //console.log(miningData);

      setMiningData(miningData);
    } catch (err: any) {
      setError(
        err.message || "fetchMiningData - An unexpected error occurred."
      );
      setMiningData(null);
    }
  };

  const fetchReferralRewards = async () => {
    resetError();
    try {
      const { data: rewardsData } = await graphqlRequest(
        `
          query {
            getReferralRewards {
              packageType
              referralBalance
            }
          }
        `
      );

      const referralRewards: ReferralReward[] =
        rewardsData.getReferralRewards.map(
          (item: { packageType: string; referralBalance: number }) => ({
            packageType: item.packageType,
            referralBalance: parseFloat(item.referralBalance.toFixed(6)), // 소수점 6자리로 자르기
          })
        );

      setReferralRewards(referralRewards);
    } catch (err: any) {
      setError(
        err.message || "fetchReferralRewards - An unexpected error occurred."
      );
      setReferralRewards(null);
    }
  };

  useEffect(() => {
    fetchMiningData();
    //fetchReferralRewards();
  }, []);

  return { miningData, referralRewards, loading, error };
}
