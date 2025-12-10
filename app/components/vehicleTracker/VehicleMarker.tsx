'use client'

import { memo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Vehicle, Trip } from '@/app/types/vehicle'

const getVehicleIcon = (vehicle: Vehicle) => {
  const color = vehicle.color
  const size = 30

  return L.divIcon({
    html: `<div style="
      background: ${color};
      color: white;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      cursor: pointer;
    ">${vehicle.icon}</div>`,
    className: 'vehicle-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

interface VehicleMarkerProps {
  vehicle: Vehicle
  location: any
  selectedTrip?: Trip | null
}

const VehicleMarker = memo(({ vehicle, location, selectedTrip }: VehicleMarkerProps) => {
  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={getVehicleIcon(vehicle)}
      eventHandlers={{
        mouseover: (e) => {
          const marker = e.target;
          marker.openPopup();
        },
        mouseout: (e) => {
          const marker = e.target;
          marker.closePopup();
        }
      }}
    >
      <Popup>
        <div className="p-3 w-64">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
            <span className="text-xl">{vehicle.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900">{vehicle.name}</h3>
              <p className="text-xs text-gray-600">{vehicle.licensePlate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-xs font-medium text-gray-500">Driver</p>
              <p className="text-sm text-gray-900">{vehicle.driverName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Speed</p>
              <p className="text-sm text-gray-900">{location.speed} km/h</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-xs font-medium text-gray-500">Fuel</p>
              <div className="flex items-center gap-1">
                <div className="w-8 h-1 bg-gray-200 rounded">
                  <div
                    className="h-1 bg-green-500 rounded"
                    style={{ width: `${location.fuelLevel}%` }}
                  />
                </div>
                <span className="text-xs text-gray-900">{location.fuelLevel}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Battery</p>
              <div className="flex items-center gap-1">
                <div className="w-8 h-1 bg-gray-200 rounded">
                  <div
                    className="h-1 bg-blue-500 rounded"
                    style={{ width: `${location.batteryLevel}%` }}
                  />
                </div>
                <span className="text-xs text-gray-900">{location.batteryLevel}%</span>
              </div>
            </div>
          </div>

          {selectedTrip && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-1">Current Trip</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">From:</span>
                  <span className="text-gray-900 truncate ml-2">
                    {selectedTrip.startLocation.address}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">To:</span>
                  <span className="text-gray-900 truncate ml-2">
                    {selectedTrip.endLocation.address}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Distance:</span>
                  <span className="text-gray-900">{selectedTrip.distance}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Est. Time:</span>
                  <span className="text-gray-900">{selectedTrip.estimatedDuration}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${
                      selectedTrip.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : selectedTrip.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedTrip.status === 'planned'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {selectedTrip.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  )
})

VehicleMarker.displayName = 'VehicleMarker'

export default VehicleMarker


