type TokenType = "USDT" | "DOGE" | "BTC";

interface WalletData {
  address: string;
  whithdrawAddress: string;
  usdtBalance: number;
}

interface MiningData {
  packageType: string;
  miningBalance: number;
}

interface PendingWithdrawal {
  currency: string;
  amount: string;
  status: string;
}

interface DepositNotification {
  walletAddress: string;
  amount: number;
}

interface WithdrawalRequest {
  currency: string;
  amount: string;
  status: string;
  createdAt: string;
}

interface WithdrawSectionProps {
  loading: boolean;
  walletData: WalletData | null;
  miningData: MiningData[] | null;
  pendingWithdrawals: PendingWithdrawal[];
  handleSaveWithdrawAddress: (address: string, otp: string) => Promise<boolean>;
  handleConfirmWithdraw: (
    otpValue: string,
    selectedToken: string,
    amount: number
  ) => Promise<boolean>;
}

interface DepositSectionProps {
  error: string | null;
  loading: boolean;
  walletData: any;
  miningData: any;
  createWallet: () => void;
}

interface OtpModalProps {
  isOpen: boolean;
  otp: string;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  setOtp: (value: string) => void;
}
