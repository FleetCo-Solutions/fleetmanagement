"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface UseFetchOptions {
  url: string;
}

export function useFetch<T = unknown>({
  url
}: UseFetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const {data: session} = useSession();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.userToken}`
        },
      });

      const result = await res.json();
      
      if (!res.ok) throw new Error(`${result.message}`);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data when the hook is called
  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}
