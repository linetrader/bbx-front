// src/components/Main/Transaction/types/common.ts

export interface Transaction {
  type: string;
  amount: string;
  token: string;
  transactionHash: string;
  createdAt: string;
}

export interface PurchaseRecord {
  packageName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}
