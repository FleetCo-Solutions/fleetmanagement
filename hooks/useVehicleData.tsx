'use client';
import { useState, useEffect } from 'react';
import { Vehicle, Trip } from '@/app/types/vehicle';

interface UseVehicleDataReturn {
  vehicles: Vehicle[];
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
}

export function useVehicleData(): UseVehicleDataReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const vehiclesResponse = await fetch('/api/vehicle-tracking?action=vehicles');

        if (!vehiclesResponse.ok) {
          throw new Error(`Failed to fetch vehicles: ${vehiclesResponse.statusText}`);
        }

        const vehiclesData = await vehiclesResponse.json();

        if (!vehiclesData.success) {
          throw new Error(vehiclesData.message || 'Failed to fetch vehicles');
        }

        // Only set vehicles if we have valid data
        if (Array.isArray(vehiclesData.data)) {
          setVehicles(vehiclesData.data);
        } else {
          setVehicles([]);
        }

        // Fetch trips (currently returns empty array as trips are not implemented)
        const tripsResponse = await fetch('/api/vehicle-tracking?action=trips');

        if (tripsResponse.ok) {
          const tripsData = await tripsResponse.json();
          if (tripsData.success && Array.isArray(tripsData.data)) {
            setTrips(tripsData.data);
          } else {
            setTrips([]);
          }
        } else {
          setTrips([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
        console.error('Data fetch error:', err);
        // Set empty arrays on error 
        setVehicles([]);
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { vehicles, trips, isLoading, error };
}

