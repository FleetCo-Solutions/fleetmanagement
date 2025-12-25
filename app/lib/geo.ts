import type { LatLngTuple } from 'leaflet';

// Haversine distance between two lat/lng points in kilometers
export function haversineDistanceKm(a: LatLngTuple, b: LatLngTuple): number {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;

  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);

  const aVal =
    sinDLat * sinDLat +
    sinDLon * sinDLon * Math.cos(lat1Rad) * Math.cos(lat2Rad);

  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
}

export interface RouteMetrics {
  segmentDistancesKm: number[];
  totalDistanceKm: number;
}

export function computeRouteMetrics(
  routeCoords: LatLngTuple[]
): RouteMetrics {
  if (!routeCoords || routeCoords.length < 2) {
    return { segmentDistancesKm: [], totalDistanceKm: 0 };
  }

  const segmentDistancesKm: number[] = [];
  let totalDistanceKm = 0;

  for (let i = 0; i < routeCoords.length - 1; i++) {
    const d = haversineDistanceKm(routeCoords[i], routeCoords[i + 1]);
    segmentDistancesKm.push(d);
    totalDistanceKm += d;
  }

  return { segmentDistancesKm, totalDistanceKm };
}


