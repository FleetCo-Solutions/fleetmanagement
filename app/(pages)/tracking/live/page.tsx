"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { generateLiveVehicles } from "@/app/data/trackingMock";
import { LiveVehicleState } from "@/app/types/tracking";

// Dynamically import the map to avoid SSR issues
const TrackingMap = dynamic(() => import("@/app/components/tracking/TrackingMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-50 flex items-center justify-center">Loading Interactive Map...</div>
});

export default function LiveTrackingPage() {
  const [vehicles, setVehicles] = useState<LiveVehicleState[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<LiveVehicleState | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Initial data
    const initialData = generateLiveVehicles(25);
    setVehicles(initialData);

    // Mock WebSocket updates every 3 seconds
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === "offline") return v;
        
        // Slightly update lat/lng to simulate movement
        const moveScale = 0.001;
        const newLat = v.lat + (Math.random() - 0.5) * moveScale;
        const newLng = v.lng + (Math.random() - 0.5) * moveScale;
        
        return {
          ...v,
          lat: newLat,
          lng: newLng,
          heading: (v.heading + (Math.random() - 0.5) * 10 + 360) % 360,
          lastUpdate: new Date().toISOString()
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVehicleSelect = (id: string) => {
    const v = vehicles.find(v => v.id === id);
    if (v) setSelectedVehicle(v);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Filters & List */}
        <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'}`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Live Fleet</h2>
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search vehicle, plate..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#004953] transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 absolute left-3 top-2.5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              
              <div className="flex gap-2">
                {['all', 'moving', 'idle', 'offline'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                      statusFilter === status 
                        ? 'bg-[#004953] text-white' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {filteredVehicles.map(v => (
              <div 
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  selectedVehicle?.id === v.id 
                    ? 'bg-[#004953]/5 border-[#004953] shadow-sm' 
                    : 'bg-white border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{v.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{v.plateNumber}</p>
                  </div>
                  <div className={`size-2 rounded-full ${
                    v.status === 'moving' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 
                    v.status === 'overspeed' ? 'bg-red-500 animate-pulse' : 
                    v.status === 'idle' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>
                    {v.speed} km/h
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {new Date(v.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: Map */}
        <main className="flex-1 relative">
          <TrackingMap 
            vehicles={filteredVehicles} 
            selectedVehicleId={selectedVehicle?.id}
            onVehicleSelect={handleVehicleSelect}
            center={selectedVehicle ? [selectedVehicle.lat, selectedVehicle.lng] : [24.7136, 46.6753]}
            zoom={selectedVehicle ? 15 : 12}
          />
          
          {/* Floating Toggle Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 bg-white rounded-lg shadow-lg border border-gray-100 hover:bg-gray-50 transition-all text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </main>

        {/* Right Sidebar: Vehicle Details */}
        {selectedVehicle && (
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col z-10 animate-in slide-in-from-right-full duration-300">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Vehicle Insights</h3>
              <button onClick={() => setSelectedVehicle(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#004953] rounded-2xl shadow-lg shadow-[#004953]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 leading-none">{selectedVehicle.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{selectedVehicle.imei}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Speed</p>
                  <p className="text-lg font-black text-[#004953]">{selectedVehicle.speed} <span className="text-xs font-medium">km/h</span></p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fuel</p>
                  <p className="text-lg font-black text-[#004953]">{selectedVehicle.fuelLevel}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Ignition</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${selectedVehicle.ignition ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedVehicle.ignition ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">GPS Signal</span>
                  <span className="flex gap-1">
                    {[1,2,3,4].map(bar => (
                      <div key={bar} className={`w-1 h-3 rounded-full ${bar <= 3 ? 'bg-green-500' : 'bg-gray-200'}`} />
                    ))}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Driver</span>
                  <span className="font-bold text-gray-900">{selectedVehicle.driverName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Odometer</span>
                  <span className="font-bold text-gray-900">{selectedVehicle.odometer} km</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Engine Hours</span>
                  <span className="font-bold text-gray-900">{selectedVehicle.engineHours} h</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ongoing Geofence</p>
                <div className="flex items-center gap-2 text-sm text-[#004953] font-bold p-3 bg-[#004953]/5 rounded-xl border border-[#004953]/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                  {selectedVehicle.geofence || "No active geofence"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="py-2.5 px-4 bg-[#004953] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#004953]/20 hover:scale-[1.02] transition-all active:scale-95">
                  Send Command
                </button>
                <button className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all active:scale-95">
                  Share Link
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
