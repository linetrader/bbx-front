// src/hooks/useDashboard.ts

import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

interface MiningData {
  packageType: string; // BTC or DOGE
  miningBalance: number;
  totalPrice: number;
}

interface ReferralReward {
  packageType: string;
  referralBalance: number;
}

interface CoinPrice {
  coinName: string; // BTC or DOGE
  language: string;
  price: number;
}

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

      // 각 코인의 데이터를 처리
      const miningData: MiningData[] = await Promise.all(
        userMiningData.getUserMiningData.map(
          async (item: { packageType: string; miningBalance: number }) => {
            // 코인 가격 조회
            const { data } = await graphqlRequest(
              `
                query ($coinName: String!, $language: String!) {
                  getCoinPrice(coinName: $coinName, language: $language) {
                    price
                  }
                }
              `,
              { coinName: item.packageType, language } // 코인 이름과 언어 전달
            );

            const price = data.getCoinPrice.price;

            // MiningData 구성
            return {
              packageType: item.packageType,
              miningBalance: parseFloat(item.miningBalance.toFixed(6)),
              totalPrice: parseFloat(
                (item.miningBalance * price).toFixed(6) // totalPrice = miningBalance * price
              ),
            };
          }
        )
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
