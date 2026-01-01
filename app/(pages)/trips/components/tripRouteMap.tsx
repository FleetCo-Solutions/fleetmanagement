'use client'
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths (required for markers to display)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TripRouteMapProps {
  startLocation: string;
  endLocation: string;
  tripId: string;
}

// Mock coordinates for Tanzanian cities
const cityCoords: Record<string, [number, number]> = {
  'Dar es Salaam': [-6.7924, 39.2083],
  'Arusha': [-3.3869, 36.6829],
  'Mwanza': [-2.5164, 32.9175],
  'Dodoma': [-6.1630, 35.7516],
  'Morogoro': [-6.8278, 37.6591],
  'Mbeya': [-8.9094, 33.4608],
  'Iringa': [-7.7697, 35.6869],
  'Songea': [-10.6833, 35.6500],
  'Kigoma': [-4.8769, 29.6267],
  'Tabora': [-5.0167, 32.8000],
  'Bukoba': [-1.3333, 31.8167],
  'Lindi': [-9.9971, 39.7145],
  'Njombe': [-9.3333, 34.7667],
};

const getCoords = (city: string): [number, number] => {
  const cityName = city.split(',')[0].trim();
  return cityCoords[cityName] || [-6.7924, 39.2083]; // Default to Dar es Salaam
};

// Create custom icons for start and end markers
const createStartIcon = () => {
  return L.divIcon({
    html: `<div style="
      background: #10B981;
      color: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      font-weight: bold;
    ">S</div>`,
    className: 'start-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createEndIcon = () => {
  return L.divIcon({
    html: `<div style="
      background: #EF4444;
      color: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      font-weight: bold;
    ">E</div>`,
    className: 'end-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const TripRouteMap: React.FC<TripRouteMapProps> = ({ startLocation, endLocation, tripId }) => {
  const startCoords = getCoords(startLocation);
  const endCoords = getCoords(endLocation);
  const route = [startCoords, endCoords];

  return (
    <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm h-full">
      <h2 className="text-xl font-bold text-black mb-4">Route Map</h2>
      <div className="h-80 rounded-lg overflow-hidden">
        <MapContainer
          center={startCoords}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Start Marker */}
          <Marker position={startCoords} icon={createStartIcon()}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-black">Start: {startLocation}</div>
                <div className="text-sm text-black/70">Trip: {tripId}</div>
              </div>
            </Popup>
          </Marker>
          
          {/* End Marker */}
          <Marker position={endCoords} icon={createEndIcon()}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-black">Destination: {endLocation}</div>
                <div className="text-sm text-black/70">Trip: {tripId}</div>
              </div>
            </Popup>
          </Marker>
          
          {/* Route Line */}
          <Polyline 
            positions={route} 
            color="#004953" 
            weight={3}
            opacity={0.8}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default TripRouteMap; 