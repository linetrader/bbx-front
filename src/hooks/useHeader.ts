// src/hooks/useHeader.ts

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTranslationContext } from "@/context/TranslationContext"; // Import TranslationContext
import { SingleValue } from "react-select";

export interface LanguageOption {
  label: string;
  flag: string;
  value: string;
}

export const options: LanguageOption[] = [
  { label: "USA", flag: "US", value: "en" },
  { label: "KOR", flag: "KR", value: "ko" },
  { label: "JPA", flag: "JP", value: "ja" },
  { label: "CHN", flag: "CN", value: "zh" },
];

export function useHeader() {
  const { logout } = useAuth();
  const { setLanguage } = useTranslationContext(); // Access TranslationContext
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = true; // Temporary hardcoded value; replace with actual authentication check.

  const handleLanguageChange = (
    selectedOption: SingleValue<LanguageOption>
  ) => {
    if (selectedOption) {
      console.log(`Language changed to: ${selectedOption.value}`);
      setLanguage(selectedOption.value); // Update the global language state
    }
  };

  const handleMenuClick = (action: string) => {
    switch (action) {
      case "notice":
        console.log("Notice clicked");
        setIsMenuOpen(false);
        break;
      case "tree":
        console.log("Tree clicked");
        setIsMenuOpen(false);
        break;
      case "wallet":
        console.log("Wallet clicked");
        setIsMenuOpen(false);
        break;
      case "auth":
        if (isLoggedIn) {
          logout();
          setIsMenuOpen(false);
        } else {
          console.log("Redirect to login");
          router.push("/login");
        }
        break;
      default:
        break;
    }
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    handleLanguageChange,
    handleMenuClick,
    options,
    isLoggedIn,
  };
}
