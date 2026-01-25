import { NextResponse } from "next/server";
import { directionsMock } from "@/public/directionsMock";

// Use a global variable to simulate state across requests in dev mode
// In a real serverless environment this wouldn't work reliably, but for local dev/mocking it's fine.
let currentIndex = 0;

export async function GET() {
  const coordinates = directionsMock.features[0].geometry.coordinates;

  // Get current coordinate
  const [lng, lat] = coordinates[currentIndex];

  // Calculate generic heading (bearing) if possible
  let heading = 0;
  if (currentIndex < coordinates.length - 1) {
    const [nextLng, nextLat] = coordinates[currentIndex + 1];
    heading = calculateBearing(lat, lng, nextLat, nextLng);
  }

  const mockLocation = {
    lat,
    lng,
    speed: 60 + Math.random() * 10, // Simulate speed between 60-70 km/h
    heading,
    timestamp: new Date().toISOString(),
    status: "moving",
  };

  // Increment index for next call
  currentIndex++;
  if (currentIndex >= coordinates.length) {
    currentIndex = 0; // Loop back to start
  }

  return NextResponse.json(mockLocation);
}

// Helper to calculate bearing between two points
function calculateBearing(
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number,
) {
  const startLatRad = toRadians(startLat);
  const startLngRad = toRadians(startLng);
  const destLatRad = toRadians(destLat);
  const destLngRad = toRadians(destLng);

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) *
      Math.cos(destLatRad) *
      Math.cos(destLngRad - startLngRad);
  let brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  return (brng + 360) % 360;
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}
