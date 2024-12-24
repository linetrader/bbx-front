// components/Profile.tsx

"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";

interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/graphql", {
        query: `
          query {
            me {
              username
              email
              firstname
              lastname
            }
          }
        `,
      });

      if (data.errors) {
        throw new Error(data.errors[0]?.message || "Failed to fetch profile.");
      }

      setUserData(data.data.me);
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">
            Profile
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : userData ? (
            <div className="text-sm text-yellow-400">
              <p className="mb-2">
                <span className="font-bold">Username:</span> {userData.username}
              </p>
              <p className="mb-2">
                <span className="font-bold">Email:</span> {userData.email}
              </p>
              <p className="mb-2">
                <span className="font-bold">First Name:</span>{" "}
                {userData.firstname}
              </p>
              <p>
                <span className="font-bold">Last Name:</span>{" "}
                {userData.lastname}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No profile data found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
