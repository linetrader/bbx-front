"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { graphqlRequest } from "@/utils/graphqlApi";
import RegisterView from "@/components/RegisterView";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
    referrer: "",
  });

  const [error, setError] = useState("");
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const router = useRouter();

  const handleRegister = async () => {
    const missingFields = Object.entries(formData)
      .filter(([key, value]) => !value && key !== "referrer")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setRequiredFields(missingFields);
      return;
    }
    setRequiredFields([]);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { data, errors } = await graphqlRequest(
        `
          mutation Register($input: RegisterInput!) {
            register(input: $input)
          }
        `,
        { input: formData }
      );

      if (errors) {
        setError(errors[0]?.message || "Registration failed!");
        return;
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <RegisterView
      formData={formData}
      setFormData={setFormData}
      error={error}
      requiredFields={requiredFields}
      handleRegister={handleRegister}
    />
  );
}
