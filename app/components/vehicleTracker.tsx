'use client'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression, LatLngTuple } from 'leaflet'
import { useVehicleData } from '@/hooks/useVehicleData'
import { useRouting } from '@/hooks/useRouting'
import { Vehicle, Trip } from '@/app/types/vehicle'
import { useEffect, useState, useMemo, memo, forwardRef, useImperativeHandle, useRef } from 'react'
import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount()
  const size = count < 10 ? 40 : count < 100 ? 50 : 60
  
  return L.divIcon({
    html: `<div style="
      background: linear-gradient(135deg, #004953, #006064);
      color: white;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${size < 50 ? '14px' : '16px'};
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    ">${count}</div>`,
    className: 'custom-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  })
}

const VehicleMarker = memo(({ vehicle, location, selectedTrip }: {
  vehicle: Vehicle;
  location: any;
  selectedTrip?: Trip | null;
}) => {
  const getVehicleIcon = (vehicle: Vehicle, location: any) => {
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
      iconAnchor: [size / 2, size / 2]
    })
  }

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={getVehicleIcon(vehicle, location)}
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
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
            <span className="text-xl">{vehicle.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900">{vehicle.name}</h3>
              <p className="text-xs text-gray-600">{vehicle.licensePlate}</p>
            </div>
          </div>

          {/* Driver & Speed */}
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

          {/* Fuel & Battery */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-xs font-medium text-gray-500">Fuel</p>
              <div className="flex items-center gap-1">
                <div className="w-8 h-1 bg-gray-200 rounded">
                  <div 
                    className="h-1 bg-green-500 rounded" 
                    style={{ width: `${location.fuelLevel}%` }}
                  ></div>
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
                  ></div>
                </div>
                <span className="text-xs text-gray-900">{location.batteryLevel}%</span>
              </div>
            </div>
          </div>

          {/* Trip Info */}
          {selectedTrip && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 mb-1">Current Trip</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">From:</span>
                  <span className="text-gray-900 truncate ml-2">{selectedTrip.startLocation.address}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">To:</span>
                  <span className="text-gray-900 truncate ml-2">{selectedTrip.endLocation.address}</span>
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
                  <span className={`px-1 py-0.5 rounded text-xs ${
                    selectedTrip.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedTrip.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    selectedTrip.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
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

const TripRoute = ({ trip, routeCoords }: {
  trip: Trip;
  routeCoords: [number, number][];
}) => {
  if (!routeCoords || routeCoords.length < 2) return null

  return (
    <>
      <Polyline
        positions={routeCoords}
        pathOptions={{
          color: '#144CEA',
          weight: 5,
          opacity: 0.8,
          dashArray: '10, 5',
        }}
      />
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

interface VehicleTrackerProps {
  selectedVehicle?: Vehicle | null;
  selectedTrip?: Trip | null;
  onTripSelect?: (trip: Trip | null) => void;
}

const VehicleTracker = forwardRef<any, VehicleTrackerProps>(({ selectedVehicle, selectedTrip, onTripSelect }, ref) => {
  const { vehicles, trips, isLoading, error } = useVehicleData()
  const { getRoadRoute, isLoading: routingLoading } = useRouting()
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([-6.7924, 39.2083])
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])

  useImperativeHandle(ref, () => ({
    setView: (center: [number, number], zoom: number) => {
      if (mapInstance) mapInstance.setView(center, zoom);
    }
  }))

  const filteredVehicles = useMemo(() => {
    if (selectedTrip) {
      return vehicles.filter(vehicle => selectedTrip.vehicleIds.includes(vehicle.id))
    }
    if (selectedVehicle) {
      return [selectedVehicle]
    }
    return vehicles
  }, [vehicles, selectedTrip, selectedVehicle])

  const filteredLocations = useMemo(() => {
    return filteredVehicles
      .map(vehicle => vehicle.currentLocation)
      .filter(Boolean)
  }, [filteredVehicles])

  useEffect(() => {
    if (selectedVehicle?.currentLocation && mapInstance) {
      mapInstance.setView([selectedVehicle.currentLocation.latitude, selectedVehicle.currentLocation.longitude], 15)
    } else if (selectedTrip && mapInstance) {
      mapInstance.setView([selectedTrip.startLocation.latitude, selectedTrip.startLocation.longitude], 10)
    }
  }, [selectedVehicle, selectedTrip, mapInstance])

  useEffect(() => {
    const generateRoadRoute = async () => {
      if (selectedTrip) {
        try {
          const coords = await getRoadRoute(selectedTrip.startLocation, selectedTrip.endLocation);
          setRouteCoords(coords);
        } catch (error) {
          setRouteCoords([]);
        }
      } else {
        setRouteCoords([]);
      }
    };
    generateRoadRoute();
  }, [selectedTrip, getRoadRoute])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004953] mx-auto mb-2"></div>
          <div className="text-sm text-gray-600">Loading Map...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100">
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold mb-2">Error Loading Map</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={mapCenter}
        zoomControl={true}
        zoom={selectedVehicle ? 15 : selectedTrip ? 8 : 6}
        style={{ height: '100%', width: '100%' }}
        ref={(map) => {
          setMapInstance(map);
          if (map) (map as any)._mapInstance = map;
        }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        />
        
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={80}
          disableClusteringAtZoom={15}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          removeOutsideVisibleBounds={true}
        >
          {filteredVehicles.map(vehicle => {
            const location = vehicle.currentLocation
            if (!location) return null
            return (
              <VehicleMarker
                key={vehicle.id}
                vehicle={vehicle}
                location={location}
                selectedTrip={selectedTrip}
              />
            )
          })}
        </MarkerClusterGroup>

        {selectedTrip && (
          <TripRoute
            key={selectedTrip.id}
            trip={selectedTrip}
            routeCoords={routeCoords}
          />
        )}
      </MapContainer>

      {routingLoading && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#004953]"></div>
            <span className="text-sm text-gray-600">Loading route...</span>
          </div>
        </div>
      )}
    </div>
  )
})

VehicleTracker.displayName = 'VehicleTracker'
export default VehicleTracker