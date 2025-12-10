'use client'

import { Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Trip } from '@/app/types/vehicle'

const createSimulatedVehicleIcon = () => {
  const size = 34

  return L.divIcon({
    html: `<div style="
      background: #2563EB;
      color: white;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: transform 0.2s ease;
    ">🚚</div>`,
    className: 'simulated-vehicle-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

interface TripRouteProps {
  trip: Trip
  routeCoords: [number, number][]
  currentLocation?: {
    latitude: number
    longitude: number
  } | null
}

const TripRoute = ({ trip, routeCoords, currentLocation }: TripRouteProps) => {
  if (!routeCoords || routeCoords.length < 2) return null

  let coveredPath: [number, number][] = []
  let remainingPath: [number, number][] = routeCoords

  if (currentLocation) {
    let closestIndex = 0
    let closestDist = Infinity

    routeCoords.forEach(([lat, lng], idx) => {
      const d =
        (lat - currentLocation.latitude) * (lat - currentLocation.latitude) +
        (lng - currentLocation.longitude) * (lng - currentLocation.longitude)
      if (d < closestDist) {
        closestDist = d
        closestIndex = idx
      }
    })

    coveredPath = routeCoords.slice(0, closestIndex + 1)
    remainingPath = routeCoords.slice(closestIndex)
  }

  return (
    <>
      {coveredPath.length > 1 && (
        <Polyline
          positions={coveredPath}
          pathOptions={{
            color: '#9CA3AF',
            weight: 5,
            opacity: 0.8,
          }}
        />
      )}

      {remainingPath.length > 1 && (
        <Polyline
          positions={remainingPath}
          pathOptions={{
            color: '#144CEA',
            weight: 5,
            opacity: 0.9,
            dashArray: '10, 5',
          }}
        />
      )}

      {currentLocation && (
        <Marker
          position={[currentLocation.latitude, currentLocation.longitude]}
          icon={createSimulatedVehicleIcon()}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-blue-600">Live Position (simulated)</h3>
              <p className="text-xs text-gray-700">
                Lat: {currentLocation.latitude.toFixed(4)}, Lng: {currentLocation.longitude.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      <Marker position={[trip.startLocation.latitude, trip.startLocation.longitude]}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-green-600">Trip Start</h3>
            <p className="text-sm">{trip.name}</p>
            <p className="text-sm">{trip.startLocation.address}</p>
          </div>
        </Popup>
      </Marker>

      <Marker position={[trip.endLocation.latitude, trip.endLocation.longitude]}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-red-600">Trip End</h3>
            <p className="text-sm">{trip.name}</p>
            <p className="text-sm">{trip.endLocation.address}</p>
          </div>
        </Popup>
      </Marker>
    </>
  )
}

export default TripRoute


