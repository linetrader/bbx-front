interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  referralLink: string; // 추가된 속성
}

interface OtpData {
  qrCode: string;
  manualKey: string;
}
