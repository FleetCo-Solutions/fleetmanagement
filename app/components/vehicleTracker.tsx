'use client'
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet'
import { useVehicleData } from '@/hooks/useVehicleData'
import { useRouting } from '@/hooks/useRouting'
import { useWebSocket, VehicleLocationUpdate } from '@/hooks/useWebSocket'
import { Vehicle, Trip, VehicleLocation } from '@/app/types/vehicle'
import { useEffect, useState, useMemo, forwardRef, useImperativeHandle, useCallback } from 'react'
import L from 'leaflet'
import VehicleMarker from './vehicleTracker/VehicleMarker'
import TripRoute from './vehicleTracker/TripRoute'
import { useSimulatedTripProgress } from '@/hooks/useSimulatedTripProgress'

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

interface VehicleTrackerProps {
  selectedVehicle?: Vehicle | null;
  selectedTrip?: Trip | null;
  onTripSelect?: (trip: Trip | null) => void;
}

interface VehicleTrackerRef {
  setView: (center: [number, number], zoom: number) => void;
}

const VehicleTracker = forwardRef<VehicleTrackerRef, VehicleTrackerProps>(
  ({ selectedVehicle, selectedTrip, onTripSelect }: VehicleTrackerProps, ref: React.ForwardedRef<VehicleTrackerRef>) => {
  const { vehicles: initialVehicles, trips, isLoading, error } = useVehicleData()
  const { getRoadRoute, isLoading: routingLoading } = useRouting()
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([-6.7924, 39.2083])
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])
  
  // State to hold vehicles with real-time updates
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)

  // Update vehicles when initial data loads 
  useEffect(() => {
    if (initialVehicles.length > 0 || vehicles.length === 0) {
      setVehicles(initialVehicles)
    }
  }, [initialVehicles])

  // Get all vehicle IDs for WebSocket subscription
  const vehicleIds = useMemo(() => {
    return vehicles.filter((v: Vehicle) => v.id && v.currentLocation).map((v: Vehicle) => v.id)
  }, [vehicles])

  // Handle WebSocket location updates - smooth real-time tracking
  const handleLocationUpdate = useCallback((update: VehicleLocationUpdate) => {
    setVehicles((prevVehicles: Vehicle[]) => {
      return prevVehicles.map((vehicle: Vehicle) => {
        if (vehicle.id === update.vehicleId) {
          // Update vehicle location with new real-time data
          const updatedLocation: VehicleLocation = {
            id: vehicle.currentLocation?.id || `loc-${update.vehicleId}`,
            vehicleId: update.vehicleId,
            latitude: update.location.latitude,
            longitude: update.location.longitude,
            speed: update.location.speed ?? vehicle.currentLocation?.speed ?? 0,
            heading: update.location.heading ?? vehicle.currentLocation?.heading ?? 0,
            timestamp: update.timestamp.toISOString(),
            batteryLevel: vehicle.currentLocation?.batteryLevel,
            fuelLevel: vehicle.currentLocation?.fuelLevel,
            engineStatus: vehicle.currentLocation?.engineStatus ?? 'off',
            alertStatus: vehicle.currentLocation?.alertStatus ?? 'normal',
            address: vehicle.currentLocation?.address,
          }

          return {
            ...vehicle,
            currentLocation: updatedLocation,
            lastUpdate: update.timestamp.toISOString(),
          }
        }
        return vehicle
      })
    })
  }, [])

  // WebSocket connection for real-time updates
  const { isConnected, error: wsError } = useWebSocket({
    vehicleIds,
    onMessage: handleLocationUpdate,
    autoReconnect: true,
  })

  // Subscribe/unsubscribe to vehicles when list changes
  useEffect(() => {
    if (isConnected && vehicleIds.length > 0) {
      // WebSocket hook handles subscriptions automatically via vehicleIds prop
      // No manual subscription needed
    }
  }, [isConnected, vehicleIds])

  const {
    simulatedLocation,
    totalDistanceKm,
    distanceCoveredKm,
    distanceRemainingKm,
  } = useSimulatedTripProgress(selectedTrip ?? null, routeCoords)

  useImperativeHandle(ref, () => ({
    setView: (center: [number, number], zoom: number) => {
      if (mapInstance) {
        mapInstance.setView(center, zoom);
      }
    }
  }), [mapInstance])

  // Filter vehicles based on selection 
  const filteredVehicles = useMemo(() => {
    const vehiclesWithLocations = vehicles.filter((v: Vehicle) => v.currentLocation)
    
    if (selectedTrip) {
      return vehiclesWithLocations.filter((vehicle: Vehicle) => selectedTrip.vehicleIds.includes(vehicle.id))
    }
    if (selectedVehicle) {
      const selected = vehiclesWithLocations.find((v: Vehicle) => v.id === selectedVehicle.id)
      return selected ? [selected] : []
    }
    return vehiclesWithLocations
  }, [vehicles, selectedTrip, selectedVehicle])

  // Center map on selected vehicle when location updates (smooth tracking)
  useEffect(() => {
    if (selectedVehicle?.currentLocation && mapInstance) {
      const { latitude, longitude } = selectedVehicle.currentLocation
      mapInstance.setView([latitude, longitude], 15, {
        animate: true,
        duration: 0.5,
      })
    } else if (selectedTrip && mapInstance) {
      mapInstance.setView([selectedTrip.startLocation.latitude, selectedTrip.startLocation.longitude], 10)
    }
  }, [selectedVehicle?.currentLocation?.latitude, selectedVehicle?.currentLocation?.longitude, selectedTrip, mapInstance])

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
        ref={(map: L.Map | null) => {
          setMapInstance(map);
          if (map) (map as unknown as { _mapInstance: L.Map })._mapInstance = map;
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
          {filteredVehicles.map((vehicle: Vehicle) => {
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
            currentLocation={simulatedLocation}
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

      {/* WebSocket connection status indicator */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-lg flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          title={isConnected ? 'WebSocket connected' : 'WebSocket disconnected'}
        />
        <span className="text-xs text-gray-600">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>

      {selectedTrip && simulatedLocation && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg text-xs text-gray-800 space-y-1">
          <div className="font-semibold text-sm">Trip progress (simulated)</div>
          <div>Total distance: {totalDistanceKm.toFixed(1)} km</div>
          <div>Covered: {distanceCoveredKm.toFixed(1)} km</div>
          <div>Remaining: {distanceRemainingKm.toFixed(1)} km</div>
        </div>
      )}
    </div>
  )
})

VehicleTracker.displayName = 'VehicleTracker'
export default VehicleTracker