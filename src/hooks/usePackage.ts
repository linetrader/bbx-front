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
  content: string[]; // content를 배열로 정의
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
  const [showContract, setShowContract] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [defaultContract, setDefaultContract] =
    useState<DefaultContractTemplate | null>(null);

  // Fetch default contract
  const fetchDefaultContract = async () => {
    try {
      const { data } = await graphqlRequest(`
        query {
          getDefaultContract {
            content
            date
            companyName
            companyAddress
            businessNumber
            representative
          }
        }
      `);

      setDefaultContract(data.getDefaultContract);
    } catch (err: any) {
      console.error("Error fetching default contract:", err.message);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const fetchPackages = async () => {
    try {
      const { data } = await graphqlRequest(`
        query {
          getPackages {
            id
            name
            price
          }
        }
      `);

      setPackages(data.getPackages);
      const initialQuantities = data.getPackages.reduce(
        (acc: any, pkg: Package) => {
          acc[pkg.id] = 0;
          return acc;
        },
        {}
      );
      setQuantities(initialQuantities);
    } catch (err: any) {
      console.error("Error fetching packages:", err.message);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const fetchUsdtBalance = async () => {
    try {
      const { data } = await graphqlRequest(`
        query {
          getWalletInfo {
            usdtBalance
          }
        }
      `);

      // Ensure that data exists and handle the response accordingly
      if (data?.getWalletInfo) {
        //console.log("Wallet Info Success");
        setUsdtBalance(data.getWalletInfo.usdtBalance);
      } else {
        setUsdtBalance(0.0); // Wallet이 없으면 null 설정
        console.log("Wallet not found, user needs to create one.");
      }
    } catch (err: any) {
      //console.error("Error in fetchDepositWallet:", err);

      // Ensure err.message exists and is a string before calling `includes`
      if (err && typeof err === "string") {
        // Handle "Wallet not found" case
        if (err.includes("Wallet not found")) {
          setUsdtBalance(0.0);
          console.log("Wallet not found, user needs to create one.");
        } else {
          // Handle other error messages
          setError(err || "An unexpected error occurred.");
        }
      } else {
        // In case `err.message` is not defined, set a generic error message
        setError("An unexpected error occurred. endpoint");
      }
    }
  };

  const fetchUserPackages = async () => {
    try {
      const { data } = await graphqlRequest(`
        query {
          getUserMiningData {
            packageType
            quantity
          }
        }
      `);

      if (!data.error) {
        setUserPackages(data.getUserMiningData);
      }
    } catch (err: any) {
      console.error("Error fetching user packages:", err.message);
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
        `
          mutation PurchasePackage(
            $packageId: String!
            $quantity: Int!
            $customerName: String!
            $customerPhone: String!
            $customerAddress: String!
          ) {
            purchasePackage(
              packageId: $packageId
              quantity: $quantity
              customerName: $customerName
              customerPhone: $customerPhone
              customerAddress: $customerAddress
            )
          }
        `,
        { packageId, quantity, customerName, customerPhone, customerAddress }
      );

      fetchUsdtBalance();
      fetchUserPackages();
      alert(data.purchasePackage);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleContractOpen = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowContract(true);
  };

  const handleContractClose = () => {
    setSelectedPackage(null);
    setShowContract(false);
  };

  useEffect(() => {
    // usdtBalance 체크
    fetchUsdtBalance();

    fetchPackages();
    fetchUserPackages();
    fetchDefaultContract();
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
