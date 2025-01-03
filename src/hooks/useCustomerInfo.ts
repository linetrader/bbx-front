// src/hooks/useCustomerInfo.ts

import { useState } from "react";

const useCustomerInfo = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    agreed: false,
  });

  return { customerInfo, setCustomerInfo };
};

export default useCustomerInfo;
