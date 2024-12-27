// components/Profile.tsx

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import ProfileView from "@/components/ProfileView";

interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

export default function Profile() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);

    if (!token || typeof token !== "string") {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(
        "/graphql",
        {
          query: `
            query {
              getUserInfo {
                username
                email
                firstname
                lastname
              }
            }
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.errors) {
        const serverMessage =
          data.errors[0]?.message ||
          "An unexpected error occurred on the server.";
        setError(serverMessage);
        setLoading(false);
        return;
      }

      setUserData(data.data.getUserInfo);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return <ProfileView userData={userData} loading={loading} error={error} />;
}
