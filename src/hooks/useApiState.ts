import { useState } from "react";

export function useApiState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = () => setError(null);

  return { loading, setLoading, error, setError, resetError };
}
