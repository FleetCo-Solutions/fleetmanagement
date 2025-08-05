import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const MapWithRoute = dynamic(() => import('./TripMap'), { ssr: false });

interface Trip {
  destination: string;
  date: string;
  driver: string;
  distance: number;
  cost: number;
}

interface VehicleData {
  currentLocation: string;
  tripHistory: Trip[];
}

export default function TripHistoryCard({ vehicleData }: { vehicleData: VehicleData }) {
  const [selectedTrip, setSelectedTrip] = useState<number | null>(null);

  return (
    <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
      <div className="h-64 w-full">
        <MapWithRoute
          currentLocation={vehicleData.currentLocation}
          selectedTrip={selectedTrip !== null ? vehicleData.tripHistory[selectedTrip] : null}
        />
      </div>
      <h2 className="text-xl font-bold text-black my-3">Recent Trip History</h2>
      <div className="space-y-3 mb-6">
        {vehicleData.tripHistory.map((trip: Trip, index: number) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${selectedTrip === index ? 'bg-blue-100' : 'bg-gray-50'}`}
            onClick={() => setSelectedTrip(index)}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-semibold text-black">{trip.destination}</div>
                <div className="text-sm text-black/60">{new Date(trip.date).toLocaleDateString()} • {trip.driver}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-black">{trip.distance} km</div>
              <div className="text-sm text-black/60">${trip.cost}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 