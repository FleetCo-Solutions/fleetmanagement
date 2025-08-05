'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock geocoding for demo
const cityCoords: Record<string, [number, number]> = {
  'Dar es Salaam': [-6.7924, 39.2083],
  'Arusha': [-3.3869, 36.6829],
  'Mwanza': [-2.5164, 32.9175],
  'Dodoma': [-6.1630, 35.7516],
  'Morogoro': [-6.8278, 37.6591],
};

function getCoords(city: string): [number, number] {
  // Remove country if present
  const cityName = city.split(',')[0].trim();
  return cityCoords[cityName] || [-6.7924, 39.2083];
}

interface Trip {
  destination: string;
  date: string;
  driver: string;
  distance: number;
  cost: number;
}

export default function TripMap({ currentLocation, selectedTrip }: { currentLocation: string, selectedTrip: Trip | null }) {
  // For demo, assume all trips start at Dar es Salaam
  const start = getCoords('Dar es Salaam');
  const end = selectedTrip ? getCoords(selectedTrip.destination) : getCoords(currentLocation);
  const route = selectedTrip ? [start, end] : [end];

  return (
    <MapContainer center={end} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={end}>
        <Popup>
          {selectedTrip ? `Trip to ${selectedTrip.destination}` : 'Current Location'}
        </Popup>
      </Marker>
      {selectedTrip && (
        <Polyline positions={route} color="blue" />
      )}
    </MapContainer>
  );
} 