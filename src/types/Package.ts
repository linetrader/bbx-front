export interface Package {
  id: string;
  name: string;
  price: string;
}

export interface UserPackage {
  packageType: string;
  quantity: number;
}

export interface DefaultContractTemplate {
  content: string[]; // content를 배열로 정의
  date: string;
  companyName: string;
  companyAddress: string;
  businessNumber: string;
  representative: string;
}

export interface ContractInfoProps {
  contractContent: string[];
  isFullContractVisible: boolean;
  setIsFullContractVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CustomerInfoProps {
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    agreed: boolean;
  };
  setCustomerInfo: React.Dispatch<React.SetStateAction<any>>;
}

export interface FullContractModalProps {
  contractContents: string[]; // 단락들을 배열로 관리
  closeModal: () => void;
}

export interface MyPurchasesSectionProps {
  userPackages: any[];
  error: string | null;
}

export interface PackageBuySectionProps {
  availablePackages: any[];
  packageQuantities: { [key: string]: number };
  setPackageQuantities: (quantities: { [key: string]: number }) => void;
  openContractModal: (pkg: any) => void;
  usdtBalance: number;
  loading: boolean;
  error: string | null;
}

export interface PendingPurchase {
  packageName: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface PendingPurchasesProps {
  pendingPurchases: PendingPurchase[] | null;
  transactionLoading: boolean;
  transactionError: string | null;
}

export interface PackageBuyProps
  extends PendingPurchasesProps,
    PackageBuySectionProps,
    MyPurchasesSectionProps {}
