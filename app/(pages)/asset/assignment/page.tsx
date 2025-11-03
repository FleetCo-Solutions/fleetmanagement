"use client";
import React from "react";
import CalendarWidget from "./components/CalendarWidget";
import TimelineGrid from "./components/TimelineGrid";
import { mockVehicles, getAssignmentsForDate } from "./data/mockData";

export default function VehicleAssignmentPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedVehicle, setSelectedVehicle] = React.useState<string | null>(null);

  // Get assignments for the selected date
  const assignments = getAssignmentsForDate(selectedDate);
  
  // Filter assignments by selected vehicle if one is selected
  const filteredAssignments = selectedVehicle 
    ? assignments.filter(assignment => assignment.vehicleId === selectedVehicle)
    : assignments;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(selectedVehicle === vehicleId ? null : vehicleId);
  };

  return (
    <div className="bg-white h-full p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Vehicle Assignment</h1>
        <button className="bg-[#004953] text-white px-4 py-2 rounded-lg hover:bg-[#014852] transition-colors">+ Add Assignment</button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-120px)]">
        {/* Left column vehicles list */}
        <div className="w-[280px] border rounded-lg h-full overflow-auto p-3 bg-white">
          <div className="text-sm font-medium text-black mb-3">Vehicles ({mockVehicles.length})</div>
          {mockVehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className={`flex items-center gap-2 py-3 border-b last:border-b-0 cursor-pointer rounded p-2 transition-colors ${
                selectedVehicle === vehicle.id ? 'bg-[#004953] text-white' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleVehicleSelect(vehicle.id)}
            >
              <div className={`w-8 h-8 rounded ${selectedVehicle === vehicle.id ? 'bg-white' : 'bg-gray-200'}`} />
              <div className="flex flex-col">
                <span className={`font-medium ${selectedVehicle === vehicle.id ? 'text-white' : 'text-black'}`}>
                  {vehicle.registrationNumber}
                </span>
                <span className={`text-xs ${selectedVehicle === vehicle.id ? 'text-white/80' : 'text-gray-600'}`}>
                  {vehicle.status} • {vehicle.model} • {vehicle.group}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline area */}
        <div className="flex-1 border rounded-lg h-full overflow-hidden bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <button className="border px-3 py-1 rounded text-black">Today</button>
              <select className="border px-3 py-1 rounded text-black">
                <option>Day</option>
                <option>Week</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-black">
              <button className="border px-2 py-1 rounded">◀</button>
              <span className="font-medium text-black">
                {selectedDate.toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" })}
              </span>
              <button className="border px-2 py-1 rounded">▶</button>
            </div>
            <button className="border px-3 py-1 rounded text-black">Filters</button>
          </div>

          {/* Timeline and Calendar */}
          <div className="h-[calc(100%-48px)] flex">
            <div className="flex-1">
              <TimelineGrid 
                assignments={filteredAssignments}
                selectedDate={selectedDate}
                className="h-full"
              />
            </div>

            {/* Right side calendar */}
            <div className="w-[280px] border-l">
              <CalendarWidget 
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


