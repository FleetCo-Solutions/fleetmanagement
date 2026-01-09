"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import SwaggerUI to avoid SSR issues
// @ts-ignore - swagger-ui-react has React 19 compatibility issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { 
  ssr: false,
  loading: () => <div>Loading...</div>
});

// Import Swagger UI CSS
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpec() {
      try {
        const response = await fetch("/api/docs");
        if (!response.ok) {
          throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`);
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load API documentation");
        console.error("Error fetching OpenAPI spec:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSpec();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Error Loading Documentation</h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No documentation available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fleet Management API Documentation</h1>
          <p className="text-gray-600">
            Comprehensive API documentation for the Fleet Management System
          </p>
        </div>
        <div className="swagger-ui-wrapper">
          {/* @ts-ignore - swagger-ui-react types may not match React 19 */}
          <SwaggerUI spec={spec} docExpansion="list" defaultModelsExpandDepth={1} />
        </div>
      </div>
    </div>
  );
}
