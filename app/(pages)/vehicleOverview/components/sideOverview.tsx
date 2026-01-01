import React, { useState, useMemo } from "react";
import { useVehicleData } from "@/hooks/useVehicleData";
import { Vehicle, Trip } from "@/app/types/vehicle";

interface SideOverviewProps {
  openOverview: boolean;
  setOpenOverview: React.Dispatch<React.SetStateAction<boolean>>;
  onVehicleSelect?: (vehicle: Vehicle) => void;
  onTripSelect?: (trip: Trip | null) => void;
}

const SideOverview = ({
  openOverview, 
  setOpenOverview, 
  onVehicleSelect, 
  onTripSelect,
}: SideOverviewProps) => {
  const { vehicles, trips } = useVehicleData();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicles;
    return vehicles.filter(vehicle => 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driverName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);

  const vehicleTrips = useMemo(() => {
    if (!selectedVehicle) return [];
    // Filter trips by vehicle ID (trips have vehicleIds array)
    return trips.filter(trip => trip.vehicleIds.includes(selectedVehicle.id));
  }, [selectedVehicle, trips]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    onVehicleSelect?.(vehicle);
  };

  const handleTripClick = (trip: Trip) => {
    onTripSelect?.(trip);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!openOverview) return null;

  return (
    <div className="flex h-[94vh] bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Vehicles Panel */}
      <div className="w-[400px] bg-white shadow-xl border-r border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004953] to-[#006064] text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Fleet Vehicles</h2>
          <button
            onClick={() => setOpenOverview(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004953]"
          />
        </div>

        {/* Vehicles List */}
        <div className="flex-1 overflow-y-auto">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => handleVehicleClick(vehicle)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedVehicle?.id === vehicle.id 
                  ? 'bg-blue-50 border-l-4 border-l-[#004953]' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{vehicle.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                      <p className="text-sm text-gray-500">{vehicle.driverName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                      {trips.some(trip => trip.vehicleIds.includes(vehicle.id) && trip.status === 'in_progress') && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          On Trip
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trips Panel */}
      {selectedVehicle && (
        <div className="w-[400px] bg-white shadow-xl border-r border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Vehicle Trips</h2>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Vehicle Info */}
          <div className="p-4 border-b border-slate-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">{selectedVehicle.name}</h3>
            <p className="text-sm text-gray-600">{selectedVehicle.licensePlate}</p>
            <p className="text-sm text-gray-500">Driver: {selectedVehicle.driverName}</p>
            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getStatusColor(selectedVehicle.status)}`}>
              {selectedVehicle.status}
            </span>
          </div>

          {/* Trips List */}
          <div className="flex-1 overflow-y-auto">
            {vehicleTrips.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🚛</div>
                <p>No trips found for this vehicle</p>
              </div>
            ) : (
              vehicleTrips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => handleTripClick(trip)}
                  className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-semibold text-gray-900">{trip.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    From: {trip.startLocation.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    To: {trip.endLocation.address}
                  </p>
                  {trip.distance && (
                    <p className="text-xs text-gray-500 mt-1">
                      Distance: {trip.distance}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                      trip.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      trip.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                      trip.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {trip.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(trip.startTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideOverview;