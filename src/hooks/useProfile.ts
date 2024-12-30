// hooks/useProfile.ts

import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

interface OtpData {
  qrCode: string;
  manualKey: string;
}

export function useProfile() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [otpData, setOtpData] = useState<OtpData | null>(null);
  const [isOtpEnabled, setIsOtpEnabled] = useState<boolean>(false);

  const fetchProfileData = async () => {
    try {
      const { data: userInfo } = await graphqlRequest(
        `
          query {
            getUserInfo {
              username
              email
              firstname
              lastname
            }
          }
        `
      );
      setUserData(userInfo.getUserInfo);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setUserData(null);
    }
  };

  const fetchOtpData = async () => {
    try {
      const { data: otpInfo } = await graphqlRequest(
        `
          query {
            getOtpInfo {
              isOtpEnabled
            }
          }
        `
      );
      setIsOtpEnabled(otpInfo.getOtpInfo.isOtpEnabled);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleGenerateOtp = async () => {
    try {
      const { data } = await graphqlRequest(
        `
          mutation {
            generateOTP {
              qrCode
              manualKey
            }
          }
        `
      );
      setOtpData(data.generateOTP);
    } catch (err: any) {
      setError(err.message || "Failed to generate OTP.");
    }
  };

  const handleVerifyAndSaveOtp = async (otp: string): Promise<boolean> => {
    try {
      const { data } = await graphqlRequest(
        `
          mutation VerifyAndSaveOTP($otp: String!) {
            verifyAndSaveOTP(otp: $otp)
          }
        `,
        { otp }
      );

      if (data.verifyAndSaveOTP) {
        setIsOtpEnabled(true); // OTP 등록 성공 시 상태 업데이트
      }
      return data.verifyAndSaveOTP;
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP.");
      return false;
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchOtpData();
  }, []);

  return {
    userData,
    loading,
    error,
    otpData,
    isOtpEnabled,
    setIsOtpEnabled, // 반환 추가
    handleGenerateOtp,
    handleVerifyAndSaveOtp,
  };
}
