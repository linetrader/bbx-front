// components/Profile.tsx

"use client";

import { useState, useEffect } from "react";
import { useGraphQL } from "@/utils/graphqlApi";
import ProfileView from "@/components/ProfileView";

interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

export default function Profile() {
  const { graphqlRequest, loading, error, setError } = useGraphQL();
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchProfileData = async () => {
    try {
      const { data } = await graphqlRequest(
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

      setUserData(data.getUserInfo);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setUserData(null);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return <ProfileView userData={userData} loading={loading} error={error} />;
}
