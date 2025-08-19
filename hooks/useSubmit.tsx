"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface SubmitOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  values?: Record<string, any>;
}

export function useSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async ({ url, method = "POST", values }: SubmitOptions) => {
    setLoading(true);
    setError(null);

    return toast.promise(
      (async () => {
        try {
          const requestOptions: RequestInit = {
            method,
            headers: {
              "Content-Type": "application/json",
            },
          };

          // Handle GET requests (no body, use query params)
          if (method === "GET" && values) {
            const params = new URLSearchParams();
            Object.entries(values).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                params.append(key, String(value));
              }
            });
            const finalUrl = `${url}?${params.toString()}`;
            const response = await fetch(finalUrl, requestOptions);
            return response;
          }

          // Handle other methods (with body)
          if (values) {
            requestOptions.body = JSON.stringify(values);
          }
          
          const response = await fetch(url, requestOptions);
          return response;
        } finally {
          setLoading(false);
        }
      })().then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const errorMessage = errorData?.message || "Something went wrong";
          setError(errorMessage);
          throw new Error(errorMessage);
        }

        return res.json();
      }),
      {
        loading: "Submitting...",
        success: "Data submitted successfully!",
        error: (err) => {
          const errorMessage = err.message || "Submission failed";
          setError(errorMessage);
          return errorMessage;
        },
      }
    );
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return { submit, loading, error, resetError };
}
