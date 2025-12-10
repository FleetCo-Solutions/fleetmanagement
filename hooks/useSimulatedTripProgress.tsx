'use client';

import { useEffect, useState } from 'react';
import type { LatLngTuple } from 'leaflet';
import { computeRouteMetrics } from '@/app/lib/geo';
import type { Trip } from '@/app/types/vehicle';

interface SimulatedLocation {
  latitude: number;
  longitude: number;
}

interface UseSimulatedTripProgressResult {
  simulatedLocation: SimulatedLocation | null;
  totalDistanceKm: number;
  distanceCoveredKm: number;
  distanceRemainingKm: number;
}

export function useSimulatedTripProgress(
  selectedTrip: Trip | null | undefined,
  routeCoords: [number, number][]
): UseSimulatedTripProgressResult {
  const [simulatedLocation, setSimulatedLocation] = useState<SimulatedLocation | null>(null);
  const [totalDistanceKm, setTotalDistanceKm] = useState(0);
  const [distanceCoveredKm, setDistanceCoveredKm] = useState(0);
  const [distanceRemainingKm, setDistanceRemainingKm] = useState(0);

  useEffect(() => {
    if (!selectedTrip || !routeCoords || routeCoords.length < 2) {
      setSimulatedLocation(null);
      setTotalDistanceKm(0);
      setDistanceCoveredKm(0);
      setDistanceRemainingKm(0);
      return;
    }

    const { segmentDistancesKm, totalDistanceKm: totalKm } = computeRouteMetrics(
      routeCoords as LatLngTuple[]
    );

    if (totalKm === 0) {
      return;
    }

    setTotalDistanceKm(totalKm);

    const SIMULATED_SPEED_KMH = 40; // constant demo speed
    const TICK_MS = 1000;
    let currentDistanceKm = 0;

    setSimulatedLocation({
      latitude: routeCoords[0][0],
      longitude: routeCoords[0][1],
    });
    setDistanceCoveredKm(0);
    setDistanceRemainingKm(totalKm);

    const intervalId = setInterval(() => {
      currentDistanceKm += (SIMULATED_SPEED_KMH * TICK_MS) / 3_600_000;

      if (currentDistanceKm >= totalKm) {
        currentDistanceKm = totalKm;
      }

      let remaining = currentDistanceKm;
      let segmentIndex = 0;

      while (
        segmentIndex < segmentDistancesKm.length &&
        remaining > segmentDistancesKm[segmentIndex]
      ) {
        remaining -= segmentDistancesKm[segmentIndex];
        segmentIndex++;
      }

      let lat = routeCoords[routeCoords.length - 1][0];
      let lng = routeCoords[routeCoords.length - 1][1];

      if (segmentIndex < segmentDistancesKm.length) {
        const [startLat, startLng] = routeCoords[segmentIndex];
        const [endLat, endLng] = routeCoords[segmentIndex + 1];
        const segLen = segmentDistancesKm[segmentIndex] || 1;
        const t = segLen === 0 ? 0 : remaining / segLen;
        lat = startLat + (endLat - startLat) * t;
        lng = startLng + (endLng - startLng) * t;
      }

      setSimulatedLocation({
        latitude: lat,
        longitude: lng,
      });
      setDistanceCoveredKm(currentDistanceKm);
      setDistanceRemainingKm(Math.max(0, totalKm - currentDistanceKm));

      if (currentDistanceKm >= totalKm) {
        clearInterval(intervalId);
      }
    }, TICK_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedTrip, routeCoords]);

  return {
    simulatedLocation,
    totalDistanceKm,
    distanceCoveredKm,
    distanceRemainingKm,
  };
}


