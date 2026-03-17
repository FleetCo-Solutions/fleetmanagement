import { LiveVehicleState, HistorySegment, TrackingEvent, TelemetrySummary, VehicleStatus } from "./tracking";

const RIYADH_COORDS = { lat: 24.7136, lng: 46.6753 };

export const generateLiveVehicles = (count: number): LiveVehicleState[] => {
  return Array.from({ length: count }, (_, i) => {
    const status: VehicleStatus = ["moving", "idle", "overspeed", "offline"][Math.floor(Math.random() * 4)] as any;
    return {
      id: `v-${i + 1}`,
      name: `Truck-${100 + i}`,
      plateNumber: `ABC-${1000 + i}`,
      imei: `86123456789${i}`,
      status,
      ignition: status !== "offline" && Math.random() > 0.2,
      lat: RIYADH_COORDS.lat + (Math.random() - 0.5) * 0.1,
      lng: RIYADH_COORDS.lng + (Math.random() - 0.5) * 0.1,
      speed: status === "moving" ? 40 + Math.random() * 50 : status === "overspeed" ? 110 + Math.random() * 20 : 0,
      heading: Math.floor(Math.random() * 360),
      timestamp: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      fuelLevel: Math.floor(Math.random() * 100),
      odometer: 15400 + i * 120,
      engineHours: 1200 + i * 10,
      driverName: ["Ahmed K.", "Salah M.", "John D.", "Ivan P."][Math.floor(Math.random() * 4)],
      gpsSignal: "strong",
      geofence: Math.random() > 0.5 ? "Main Depot" : undefined,
      alerts: Math.floor(Math.random() * 3)
    };
  });
};

export const generateHistoryData = (vehicleId: string, hours: number = 24): { segments: HistorySegment[], events: TrackingEvent[], summary: TelemetrySummary } => {
  const segments: HistorySegment[] = [];
  const events: TrackingEvent[] = [];
  const now = new Date();
  
  let currentLat = RIYADH_COORDS.lat;
  let currentLng = RIYADH_COORDS.lng;

  for (let i = 0; i < hours; i++) {
    const startTime = new Date(now.getTime() - (hours - i) * 3600000);
    const isStop = Math.random() > 0.7;
    
    if (isStop) {
      segments.push({
        id: `seg-${i}`,
        type: "stop",
        startTime: startTime.toISOString(),
        endTime: new Date(startTime.getTime() + 1800000).toISOString(),
        durationMinutes: 30,
        distanceKm: 0,
        points: [{ lat: currentLat, lng: currentLng, timestamp: startTime.toISOString(), speed: 0, heading: 0 }]
      });
    } else {
      const points = Array.from({ length: 10 }, (_, j) => {
        currentLat += (Math.random() - 0.5) * 0.01;
        currentLng += (Math.random() - 0.5) * 0.01;
        return {
          lat: currentLat,
          lng: currentLng,
          timestamp: new Date(startTime.getTime() + j * 360000).toISOString(),
          speed: 60 + Math.random() * 40,
          heading: Math.floor(Math.random() * 360)
        };
      });
      
      segments.push({
        id: `seg-${i}`,
        type: "driving",
        startTime: startTime.toISOString(),
        endTime: new Date(startTime.getTime() + 3600000).toISOString(),
        durationMinutes: 60,
        distanceKm: 12.5,
        points,
        avgSpeed: 75,
        maxSpeed: 105
      });

      if (Math.random() > 0.8) {
        events.push({
          id: `evt-${i}`,
          type: "overspeed",
          severity: "medium",
          timestamp: startTime.toISOString(),
          lat: currentLat,
          lng: currentLng,
          value: 115,
          description: "Vehicle exceeded speed limit"
        });
      }
    }
  }

  const summary: TelemetrySummary = {
    totalDistance: segments.reduce((acc, s) => acc + s.distanceKm, 0),
    totalDrivingTime: segments.filter(s => s.type === "driving").length * 60,
    totalIdleTime: segments.filter(s => s.type === "stop").length * 30,
    maxSpeed: 120,
    avgSpeed: 65,
    fuelConsumed: 45.2,
    stopCount: segments.filter(s => s.type === "stop").length,
    geofenceVisits: 4
  };

  return { segments, events, summary };
};
