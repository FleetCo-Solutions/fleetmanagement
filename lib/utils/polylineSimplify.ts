/**
 * Simplify a polyline for display (e.g. map rendering) to reduce point count
 * while preserving shape. Uses Douglas-Peucker algorithm.
 *
 * @param points - Array of [lat, lng] or [lng, lat] (we use index 0,1 as x,y)
 * @param maxPoints - Maximum number of points to keep (default 500)
 * @param toleranceMeters - Simplification tolerance in meters (default ~5m); higher = fewer points
 * @returns Simplified array of the same coordinate format
 */
export function simplifyPolyline<T extends [number, number]>(
  points: T[],
  maxPoints: number = 500,
  toleranceMeters: number = 5
): T[] {
  if (points.length <= maxPoints) return points;

  // Douglas-Peucker with squared distance (avoid sqrt until needed for tolerance)
  const tol = toleranceMeters / 111320; // rough degrees at equator for meters
  const tolSq = tol * tol;

  function perpendicularDistanceSq(
    p: [number, number],
    a: [number, number],
    b: [number, number]
  ): number {
    const [px, py] = p;
    const [ax, ay] = a;
    const [bx, by] = b;
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return (px - ax) ** 2 + (py - ay) ** 2;
    let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const qx = ax + t * dx;
    const qy = ay + t * dy;
    return (px - qx) ** 2 + (py - qy) ** 2;
  }

  function douglasPeucker(arr: T[], tolSq: number): T[] {
    if (arr.length <= 2) return arr;
    let maxDistSq = 0;
    let maxIdx = 0;
    const first = arr[0] as [number, number];
    const last = arr[arr.length - 1] as [number, number];
    for (let i = 1; i < arr.length - 1; i++) {
      const d = perpendicularDistanceSq(
        arr[i] as [number, number],
        first,
        last
      );
      if (d > maxDistSq) {
        maxDistSq = d;
        maxIdx = i;
      }
    }
    if (maxDistSq <= tolSq) return [arr[0], arr[arr.length - 1]];
    const left = douglasPeucker(arr.slice(0, maxIdx + 1), tolSq);
    const right = douglasPeucker(arr.slice(maxIdx), tolSq);
    return [...left.slice(0, -1), ...right];
  }

  let simplified = douglasPeucker(points, tolSq) as T[];

  // If still over maxPoints, sample evenly
  if (simplified.length > maxPoints) {
    const step = (simplified.length - 1) / (maxPoints - 1);
    const result: T[] = [];
    for (let i = 0; i < maxPoints; i++) {
      const idx = i === maxPoints - 1 ? simplified.length - 1 : Math.round(i * step);
      result.push(simplified[idx]);
    }
    simplified = result;
  }

  return simplified;
}
