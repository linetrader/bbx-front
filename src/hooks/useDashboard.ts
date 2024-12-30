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
  const { graphqlRequest, loading, error, resetError } = useGraphQL();
  const [miningData, setMiningData] = useState<MiningData | null>(null);
  const [referralRewards, setReferralRewards] =
    useState<ReferralRewards | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      //   resetError();
      //   try {
      //     // GraphQL 쿼리
      //     const query = `
      //       query DashboardData {
      //         miningData {
      //           btcMined
      //           dogeMined
      //         }
      //         referralRewards {
      //           btcReferral
      //           dogeReferral
      //           usdtReferral
      //         }
      //       }
      //     `;
      //     // 요청 보내기
      //     const response = await graphqlRequest(query);
      //     if (response.data) {
      //       const { miningData, referralRewards } = response.data;
      //       setMiningData(miningData);
      //       setReferralRewards(referralRewards);
      //     }
      //   } catch (err) {
      //     console.error("Failed to fetch dashboard data:", err);
      //   }
    };

    fetchDashboardData();
  }, [graphqlRequest, resetError]);

  return { miningData, referralRewards, loading, error };
}
