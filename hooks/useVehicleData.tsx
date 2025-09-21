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
        
        // Fetch vehicles
        const vehiclesResponse = await fetch('/api/vehicle-tracking?action=vehicles');
        const vehiclesData = await vehiclesResponse.json();
        
        // Fetch trips
        const tripsResponse = await fetch('/api/vehicle-tracking?action=trips');
        const tripsData = await tripsResponse.json();
        
        if (vehiclesData.success) {
          setVehicles(vehiclesData.data);
        }
        
        if (tripsData.success) {
          setTrips(tripsData.data);
        }
        
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { vehicles, trips, isLoading, error };
}

