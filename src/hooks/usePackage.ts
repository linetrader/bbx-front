import { useState, useEffect } from "react";
import { useGraphQL } from "../utils/graphqlApi";

interface Package {
  id: string;
  name: string;
  price: string;
}

interface PurchaseRecord {
  packageName: string;
  quantity: number;
}

export function usePackage() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [packages, setPackages] = useState<Package[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [usdtBalance, setUsdtBalance] = useState(0.0);
  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([]);

  const fetchPackages = async () => {
    try {
      const { data } = await graphqlRequest(
        `query { getPackages { id name price } }`
      );

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
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const fetchUsdtBalance = async () => {
    try {
      const { data } = await graphqlRequest(
        `query { getWalletInfo { usdtBalance } }`
      );

      setUsdtBalance(data.getWalletInfo.usdtBalance);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const fetchPurchaseRecords = async () => {
    try {
      const { data } = await graphqlRequest(
        `query { getPurchaseRecords { packageName quantity } }`
      );

      const aggregatedRecords: PurchaseRecord[] = Object.values(
        data.getPurchaseRecords.reduce((acc: any, record: any) => {
          if (!acc[record.packageName]) {
            acc[record.packageName] = {
              packageName: record.packageName,
              quantity: 0,
            };
          }
          acc[record.packageName].quantity += record.quantity;
          return acc;
        }, {})
      );

      setPurchaseRecords(aggregatedRecords);
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
      fetchPurchaseRecords();
      alert(data.purchasePackage);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchUsdtBalance();
    fetchPurchaseRecords();
  }, []);

  return {
    packages,
    quantities,
    usdtBalance,
    purchaseRecords,
    loading,
    error,
    setQuantities,
    handlePurchase,
  };
}
