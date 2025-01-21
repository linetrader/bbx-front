// src/hooks/useDashboard.ts

import { useState } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

export function useDashboard() {
  const { graphqlRequest, loading, error, setError, resetError } = useGraphQL();
  const [miningData, setMiningData] = useState<MiningData[] | null>(null);
  const [coinPrice, setCoinPrice] = useState<CoinPrice | null>(null);
  const [referralRewards, setReferralRewards] = useState<
    ReferralReward[] | null
  >(null);

  // 코인 가격 조회
  const fetchCoinPrice = async (coinName: string, language: string) => {
    resetError();
    try {
      const { data } = await graphqlRequest(
        `
          query ($coinName: String!, $language: String!) {
            getCoinPrice(coinName: $coinName, language: $language) {
              coinName
              language
              price
            }
          }
        `,
        { coinName, language } // GraphQL 변수 전달
      );

      setCoinPrice(data.getCoinPrice);
    } catch (err: any) {
      setError(err.message || "fetchCoinPrice - An unexpected error occurred.");
      setCoinPrice(null);
    }
  };

  async function fetchMiningData(language: string) {
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

      const coinPrices = await Promise.all(
        userMiningData.getUserMiningData.map(
          async (item: { packageType: string }) => {
            const { data } = await graphqlRequest(
              `
                query ($coinName: String!, $language: String!) {
                  getCoinPrice(coinName: $coinName, language: $language) {
                    price
                  }
                }
              `,
              { coinName: item.packageType, language }
            );
            return {
              packageType: item.packageType,
              price: data.getCoinPrice.price,
            };
          }
        )
      );

      const miningData: MiningData[] = userMiningData.getUserMiningData.map(
        (item: { packageType: string; miningBalance: number }) => {
          const coinPrice =
            coinPrices.find((price) => price.packageType === item.packageType)
              ?.price || 0;
          return {
            packageType: item.packageType,
            miningBalance: parseFloat(item.miningBalance.toFixed(6)),
            totalPrice: parseFloat((item.miningBalance * coinPrice).toFixed(6)),
          };
        }
      );

      setMiningData(miningData);
    } catch (err: any) {
      setError(
        err.message || "fetchMiningData - An unexpected error occurred."
      );
      setMiningData(null);
    }
  }

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

  // useEffect(() => {
  //   fetchMiningData();
  //   //fetchReferralRewards();
  // }, []);

  return {
    miningData,
    referralRewards,
    loading,
    error,
    fetchMiningData,
    fetchCoinPrice,
  };
}
