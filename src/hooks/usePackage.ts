// src/hooks/usePackage.ts

import { useState, useEffect } from "react";
import { useGraphQL } from "../utils/graphqlApi";

interface Package {
  id: string;
  name: string;
  price: string;
}

interface UserPackage {
  packageType: string;
  quantity: number;
}

export function usePackage() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [packages, setPackages] = useState<Package[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [usdtBalance, setUsdtBalance] = useState(0.0);
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);

  const fetchPackages = async () => {
    try {
      const { data } = await graphqlRequest(
        `query { getPackages { id name price } }`
      );

      //console.log("fetchPackages", data.getPackages);

      setPackages(data.getPackages);

      const initialQuantities = data.getPackages.reduce(
        (acc: any, pkg: Package) => {
          acc[pkg.id] = 0;
          return acc;
        },
        {}
      );

      //console.log("fetchPackages", initialQuantities);

      setQuantities(initialQuantities);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const fetchUsdtBalance = async () => {
    try {
      const { data } = await graphqlRequest(
        `query { getWalletInfo { usdtBalance } }`
      );

      //console.log("fetchUsdtBalance", data.getWalletInfo.usdtBalance);

      setUsdtBalance(data.getWalletInfo.usdtBalance);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  // 3. 유저의 패키지 수량 가져오기
  const fetchUserPackages = async () => {
    try {
      const { data } = await graphqlRequest(
        `query { getUserPackages { packageType quantity } }`
      );

      setUserPackages(data.getUserPackages);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handlePurchase = async (packageId: string) => {
    try {
      const quantity = quantities[packageId];

      if (quantity <= 0) {
        setError("Quantity must be greater than zero.");
        return;
      }

      const { data } = await graphqlRequest(
        `mutation PurchasePackage($packageId: String!, $quantity: Int!) {
          purchasePackage(packageId: $packageId, quantity: $quantity)
        }`,
        { packageId, quantity }
      );

      fetchUsdtBalance();
      fetchUserPackages();
      alert(data.purchasePackage);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchUsdtBalance();
    fetchUserPackages();
  }, []);

  return {
    packages,
    quantities,
    usdtBalance,
    userPackages,
    loading,
    error,
    setQuantities,
    handlePurchase,
  };
}
