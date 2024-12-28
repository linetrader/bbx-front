"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGraphQL } from "@/utils/graphqlApi";

export function useRegister() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
    referrer: "",
  });
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const router = useRouter();

  const handleRegister = async () => {
    // Check for missing required fields
    const missingFields = Object.entries(formData)
      .filter(([key, value]) => !value && key !== "referrer")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setRequiredFields(missingFields);
      return;
    }
    setRequiredFields([]);

    // Check for password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data } = await graphqlRequest(
        `
          mutation Register(
            $email: String!
            $username: String!
            $firstname: String!
            $lastname: String!
            $password: String!
            $referrer: String
          ) {
            register(
              email: $email
              username: $username
              firstname: $firstname
              lastname: $lastname
              password: $password
              referrer: $referrer
            )
          }
        `,
        {
          email: formData.email,
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          password: formData.password,
          referrer: formData.referrer || null,
        },
        true // Skip auth check for registration
      );

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return {
    formData,
    setFormData,
    handleRegister,
    loading,
    error,
    requiredFields,
  };
}
