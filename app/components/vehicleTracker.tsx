'use client'
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet'
import { useVehicleData } from '@/hooks/useVehicleData'
import { useRouting } from '@/hooks/useRouting'
import { Vehicle, Trip } from '@/app/types/vehicle'
import { useEffect, useState, useMemo, forwardRef, useImperativeHandle } from 'react'
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

const VehicleTracker = forwardRef<any, VehicleTrackerProps>(({ selectedVehicle, selectedTrip, onTripSelect }, ref) => {
  const { vehicles, trips, isLoading, error } = useVehicleData()
  const { getRoadRoute, isLoading: routingLoading } = useRouting()
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([-6.7924, 39.2083])
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])

  const {
    simulatedLocation,
    totalDistanceKm,
    distanceCoveredKm,
    distanceRemainingKm,
  } = useSimulatedTripProgress(selectedTrip ?? null, routeCoords)

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