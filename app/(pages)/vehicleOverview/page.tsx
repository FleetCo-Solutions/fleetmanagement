'use client'
import VehicleCard from "@/app/components/vehicleOverview/vehicleCard";
import SideOverview from "./components/sideOverview";
import { useState, useMemo, useRef, forwardRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useVehicleData } from "@/hooks/useVehicleData";
import { Vehicle, Trip } from "@/app/types/vehicle";

// Create a singleton dynamic import to prevent recreation
let VehicleTrackerComponent: any = null;

const getVehicleTracker = () => {
  if (!VehicleTrackerComponent) {
    VehicleTrackerComponent = dynamic(() => import('@/app/components/vehicleTracker'), {
      ssr: false,
      loading: () => (
        <div className="flex items-center justify-center h-full bg-slate-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004953] mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading Map...</div>
          </div>
        </div>
      )
    });
  }
  return VehicleTrackerComponent;
};

// Create a stable wrapper component
const VehicleTrackerWrapper = forwardRef<any, any>((props, ref) => {
  const VehicleTracker = getVehicleTracker();
  return <VehicleTracker ref={ref} {...props} />;
});

VehicleTrackerWrapper.displayName = 'VehicleTrackerWrapper';

const VehiclesOverview = () => {
  const [openOverview, setOpenOverview] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const { vehicles, trips } = useVehicleData()
  const mapRef = useRef<any>(null)
  
  // Debug: Log when component re-renders
  console.log('VehiclesOverview re-rendered at:', new Date().toISOString())

  // Memoize stats calculations to prevent unnecessary recalculations
  const stats = useMemo(() => {
    const vehiclesWithErrors = vehicles.filter(v => 
      v.currentLocation?.alertStatus === 'critical'
    ).length
    
    const vehiclesWithWarnings = vehicles.filter(v => 
      v.currentLocation?.alertStatus === 'warning'
    ).length
    
    const activeVehicles = vehicles.filter(v => v.status === 'active').length
    
    // Count vehicles with active trips
    const vehiclesOnTrip = vehicles.filter(v => {
      return trips.some(trip => 
        trip.vehicleIds.includes(v.id) && trip.status === 'in_progress'
      )
    }).length
    
    return {
      vehiclesWithErrors,
      vehiclesWithWarnings,
      activeVehicles,
      vehiclesOnTrip
    }
  }, [vehicles, trips])

  const handleVehicleSelect = (vehicle: Vehicle) => {
    console.log('Vehicle selected:', vehicle);
    setSelectedVehicle(vehicle)
    setSelectedTrip(null)
    // Center map on vehicle location
    if (vehicle.currentLocation && mapRef.current) {
      console.log('Calling setView for vehicle:', vehicle.currentLocation);
      mapRef.current.setView([vehicle.currentLocation.latitude, vehicle.currentLocation.longitude], 15)
    } else {
      console.log('No current location or map ref not available');
    }
  }

  const handleTripSelect = (trip: Trip | null) => {
    console.log('Trip selected:', trip);
    setSelectedTrip(trip)
    // Center map on trip start location
    if (trip && mapRef.current) {
      console.log('Calling setView for trip:', trip.startLocation);
      mapRef.current.setView([trip.startLocation.latitude, trip.startLocation.longitude], 10)
    } else {
      console.log('Map ref not available or no trip selected');
    }
  }

  // Handle map centering when selected vehicle or trip changes (without reloading map)
  useEffect(() => {
    if (selectedVehicle?.currentLocation && mapRef.current) {
      console.log('Effect: Centering on vehicle:', selectedVehicle.currentLocation);
      setTimeout(() => {
        if (selectedVehicle.currentLocation) {
          mapRef.current?.setView([selectedVehicle.currentLocation.latitude, selectedVehicle.currentLocation.longitude], 15);
        }
      }, 100);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    if (selectedTrip && mapRef.current) {
      console.log('Effect: Centering on trip:', selectedTrip.startLocation);
      setTimeout(() => {
        mapRef.current?.setView([selectedTrip.startLocation.latitude, selectedTrip.startLocation.longitude], 10);
      }, 100);
    }
  }, [selectedTrip]);
  
  return (
    <div className="flex h-full w-full">
    <SideOverview 
      openOverview={openOverview} 
      setOpenOverview={setOpenOverview}
      onVehicleSelect={handleVehicleSelect}
      onTripSelect={handleTripSelect}
    />
    <div className=" h-full bg-slate-100 flex-1 relative">
      <VehicleTrackerWrapper 
        ref={mapRef}
        selectedVehicle={selectedVehicle}
        selectedTrip={selectedTrip}
        onTripSelect={handleTripSelect}
      />
      <div className="absolute top-0 left-0 z-[999] flex gap-4 py-4 justify-between w-full cursor-pointer">
        {!openOverview && <div className="bg-white flex items-center px-3 rounded-lg ml-4" onClick={()=> setOpenOverview(!openOverview)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="black"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>}
        <VehicleCard vehiclesNo={stats.vehiclesWithErrors} description="Vehicles with Errors" />
        <VehicleCard vehiclesNo={stats.vehiclesWithWarnings} description="Vehicles with Warnings" />
        <VehicleCard vehiclesNo={10} description="Deviation from a Route" />
        <VehicleCard
          vehiclesNo={stats.activeVehicles}
          description="Active Vehicles"
        />
        <VehicleCard
          vehiclesNo={stats.vehiclesOnTrip}
          description="On Trip"
        />
        <div className="bg-white flex items-center px-3 rounded-lg mr-4">
        </div>
      </div>
    </div>
    </div>
  );
};

export default VehiclesOverview;
