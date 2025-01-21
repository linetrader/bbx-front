import { useState } from "react";
import { useGraphQL } from "../utils/graphqlApi";
import { DefaultContractTemplate, Package, UserPackage } from "@/types/Package";

export function usePackage() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
  const [packageQuantities, setPackageQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [usdtBalance, setUsdtBalance] = useState(0.0);
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
  const [defaultContract, setDefaultContract] =
    useState<DefaultContractTemplate | null>(null);

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

  const fetchAvailablePackages = async () => {
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

      setAvailablePackages(data.getPackages);
      const initialQuantities = data.getPackages.reduce(
        (acc: any, pkg: Package) => {
          acc[pkg.id] = 0;
          return acc;
        },
        {}
      );
      setPackageQuantities(initialQuantities);
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

      setUsdtBalance(data?.getWalletInfo?.usdtBalance || 0.0);
      if (!data?.getWalletInfo) {
        console.log("Wallet not found, user needs to create one.");
      }
    } catch (err: any) {
      if (err && typeof err === "string" && err.includes("Wallet not found")) {
        setUsdtBalance(0.0);
        console.log("Wallet not found, user needs to create one.");
      } else {
        setError(err.message || "An unexpected error occurred.");
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

  const handlePackagePurchase = async (
    packageId: string,
    customerName: string,
    customerPhone: string,
    customerAddress: string
  ) => {
    try {
      const quantity = packageQuantities[packageId];
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

  return {
    defaultContract,
    availablePackages,
    packageQuantities,
    usdtBalance,
    userPackages,
    loading,
    error,
    setPackageQuantities,
    handlePackagePurchase,
    fetchUsdtBalance,
    fetchAvailablePackages,
    fetchUserPackages,
    fetchDefaultContract,
  };
}
