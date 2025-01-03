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

interface DefaultContractTemplate {
  content: string;
  date: string;
  companyName: string;
  companyAddress: string;
  businessNumber: string;
  representative: string;
}

export function usePackage() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [packages, setPackages] = useState<Package[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [usdtBalance, setUsdtBalance] = useState(0.0);
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);

  // 추가: 계약서 관련 상태
  const [showContract, setShowContract] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [defaultContract, setDefaultContract] =
    useState<DefaultContractTemplate | null>(null);

  const fetchDefaultContract = async () => {
    //console.log("fetchDefaultContract");
    try {
      const { data } = await graphqlRequest(`query { getDefaultContract { 
        content 
        date 
        companyName 
        companyAddress 
        businessNumber 
        representative 
      } }`);
      setDefaultContract(data.getDefaultContract);
    } catch (err: any) {
      console.log("fetchDefaultContract - ", err.message);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const fetchPackages = async () => {
    //console.log("fetchPackages");
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
      console.log("fetchPackages - ", err.message);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const fetchUsdtBalance = async () => {
    //console.log("fetchUsdtBalance");
    try {
      const { data } = await graphqlRequest(
        `query { getWalletInfo { usdtBalance } }`
      );

      //console.log("fetchUsdtBalance == ", data);

      setUsdtBalance(data.getWalletInfo.usdtBalance);
      //console.log("fetchUsdtBalance", data.getWalletInfo.usdtBalance);
    } catch (err: any) {
      console.log("fetchUsdtBalance - ", err.message);
      setError(err.message || "Wallet not found.");
    }
  };

  // 3. 유저의 패키지 수량 가져오기
  const fetchUserPackages = async () => {
    //console.log("fetchUserPackages");
    try {
      const { data } = await graphqlRequest(
        `query { getUserMiningData { packageType quantity } }`
      );

      if (!data.error) {
        setUserPackages(data.getUserMiningData);
      }
    } catch (err: any) {
      console.log("fetchUserPackages - ", err.message);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handlePurchase = async (
    packageId: string,
    customerName: string,
    customerPhone: string,
    customerAddress: string
  ) => {
    try {
      const quantity = quantities[packageId];

      if (quantity <= 0) {
        setError("Quantity must be greater than zero.");
        return;
      }

      const { data } = await graphqlRequest(
        `mutation PurchasePackage(
          $packageId: String!,
          $quantity: Int!,
          $customerName: String!,
          $customerPhone: String!,
          $customerAddress: String!
        ) {
          purchasePackage(
            packageId: $packageId,
            quantity: $quantity,
            customerName: $customerName,
            customerPhone: $customerPhone,
            customerAddress: $customerAddress
          )
        }`,
        { packageId, quantity, customerName, customerPhone, customerAddress }
      );

      fetchUsdtBalance();
      fetchUserPackages();
      alert(data.purchasePackage);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  // 추가: 계약서 열기
  const handleContractOpen = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowContract(true);
  };

  // 추가: 계약서 닫기
  const handleContractClose = () => {
    setSelectedPackage(null);
    setShowContract(false);
  };

  useEffect(() => {
    fetchPackages();
    fetchUsdtBalance();
    fetchUserPackages();
    fetchDefaultContract(); // 기본 계약 정보 가져오기
  }, []);

  return {
    defaultContract,
    packages,
    quantities,
    usdtBalance,
    userPackages,
    loading,
    error,
    setQuantities,
    handlePurchase,
    showContract,
    selectedPackage,
    handleContractOpen,
    handleContractClose,
  };
}
