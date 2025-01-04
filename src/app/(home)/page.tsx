// src/app/(home)/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem("token");

      if (!isAuthenticated) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }

      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
        <h1>Loading...</h1>
      </div>
    );
  }

  return null;
}
