// components/Profile.tsx

"use client";

interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

interface ProfileProps {
  userData: UserData | null;
  loading: boolean;
}

export default function Profile({ userData, loading }: ProfileProps) {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>Failed to load profile data.</p>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-xl font-semibold text-yellow-400 mb-4">Profile</h2>
      <div className="text-sm">
        <p className="mb-2">
          <span className="font-bold">Username:</span> {userData.username}
        </p>
        <p className="mb-2">
          <span className="font-bold">Email:</span> {userData.email}
        </p>
        <p className="mb-2">
          <span className="font-bold">First Name:</span> {userData.firstname}
        </p>
        <p>
          <span className="font-bold">Last Name:</span> {userData.lastname}
        </p>
      </div>
    </div>
  );
}
