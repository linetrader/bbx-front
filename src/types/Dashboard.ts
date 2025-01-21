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
