'use client';
import { useState, useCallback } from 'react';
import polyline from "@mapbox/polyline";

interface TripLocation {
  latitude: number;
  longitude: number;
  address: string;
}

interface UseRoutingReturn {
  getRoadRoute: (start: TripLocation, end: TripLocation) => Promise<[number, number][]>;
  isLoading: boolean;
  error: string | null;
}

export function useRouting(): UseRoutingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRoadRoute = useCallback(async (start: TripLocation, end: TripLocation): Promise<[number, number][]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car/json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImMxMmY2MjZkNjAzYzQ0MjJiNDk5Yjc1MWQxNmUyNzNjIiwiaCI6Im11cm11cjY0In0='
        },
        body: JSON.stringify({
          coordinates: [[start.longitude, start.latitude], [end.longitude, end.latitude]],
          format: 'json'
        })
      });

      if (!response.ok) {
        throw new Error(`Routing API failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.routes && data.routes[0] && data.routes[0].geometry) {
        const coords = polyline.decode(data.routes[0].geometry);
        return coords;
      }
      
      throw new Error('No route found');
    } catch (err) {
      console.error('Routing error:', err);
      setError(err instanceof Error ? err.message : 'Routing failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getRoadRoute, isLoading, error };
}