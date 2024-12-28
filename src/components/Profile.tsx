// components/Profile.tsx

"use client";

import React from "react";
import { useProfile } from "@/hooks/useProfile";

export default function Profile() {
  const { userData, loading, error } = useProfile();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="flex-grow flex items-start justify-center pt-24">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
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
            <div className="text-sm text-white">
              <div className="mb-4 p-4 border rounded border-gray-700 bg-gray-800">
                <p className="mb-2">
                  <span className="font-bold">Username:</span>{" "}
                  {userData.username}
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
