// hooks/useProfile.ts

import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";

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
      const user = userInfo.getUserInfo;
      user.referralLink = `https://bitboost-x.com/register?ref=${user.username}`;
      setUserData(user);
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

  const handleGenerateOtp = async (): Promise<boolean> => {
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

      if (data) {
        console.log("handleGenerateOtp - data", data.generateOTP);
        setOtpData(data.generateOTP);
        return true;
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate OTP.");
      return false;
    }
    return false;
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

      console.log("handleVerifyAndSaveOtp - otp", otp);

      if (data.verifyAndSaveOTP) {
        setIsOtpEnabled(true); // OTP 등록 성공 시 상태 업데이트
      }
      return data.verifyAndSaveOTP;
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP.");
      return false;
    }
  };

  const handleChangePassword = async (
    newPassword: string
  ): Promise<boolean> => {
    try {
      const { data } = await graphqlRequest(
        `
          mutation ChangePassword($newPassword: String!) {
            changePassword(newPassword: $newPassword)
          }
        `,
        { newPassword }
      );

      if (data.changePassword) {
        console.log("Password changed successfully!");
        return true;
      }
    } catch (err: any) {
      setError(err.message || "Failed to change password.");
      return false;
    }
    return false;
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
    setOtpData,
    setIsOtpEnabled, // 반환 추가
    handleGenerateOtp,
    handleVerifyAndSaveOtp,
    handleChangePassword,
  };
}
