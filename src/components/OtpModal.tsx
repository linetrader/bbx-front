"use client";

import React from "react";

interface OtpModalProps {
  isOpen: boolean;
  otp: string;
  onClose: () => void;
  onConfirm: (otp: string) => void; // 수정된 시그니처
  setOtp: (value: string) => void;
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  otp,
  onClose,
  onConfirm,
  setOtp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold text-center text-yellow-400 mb-4">
          Enter Google OTP
        </h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-700 text-white placeholder-gray-400 mb-4"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(otp)} // 래핑 함수로 otp 전달
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
