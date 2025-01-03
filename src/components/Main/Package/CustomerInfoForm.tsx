// src/components/CustomerInfoForm.tsx
import React from "react";

interface CustomerInfoProps {
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    agreed: boolean;
  };
  setCustomerInfo: React.Dispatch<React.SetStateAction<any>>;
}

const CustomerInfoForm: React.FC<CustomerInfoProps> = ({
  customerInfo,
  setCustomerInfo,
}) => {
  return (
    <div className="p-6 bg-gray-800 rounded-lg border border-cyan-500 mb-6">
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Name</label>
        <input
          type="text"
          value={customerInfo.name}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, name: e.target.value })
          }
          className="w-full px-4 py-2 border rounded bg-gray-700 text-white placeholder-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Phone</label>
        <input
          type="text"
          value={customerInfo.phone}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, phone: e.target.value })
          }
          className="w-full px-4 py-2 border rounded bg-gray-700 text-white placeholder-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Address</label>
        <input
          type="text"
          value={customerInfo.address}
          onChange={(e) =>
            setCustomerInfo({ ...customerInfo, address: e.target.value })
          }
          className="w-full px-4 py-2 border rounded bg-gray-700 text-white placeholder-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center text-gray-300">
          <input
            type="checkbox"
            checked={customerInfo.agreed}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, agreed: e.target.checked })
            }
            className="mr-2"
          />
          I agree to the terms and conditions.
        </label>
      </div>
    </div>
  );
};

export default CustomerInfoForm;
