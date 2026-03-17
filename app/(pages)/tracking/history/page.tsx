"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { generateHistoryData, generateLiveVehicles } from "@/app/data/trackingMock";
import { HistorySegment, TrackingEvent, TelemetrySummary, GPSPoint, LiveVehicleState } from "@/app/types/tracking";
import TripTachograph from "@/app/components/tracking/TripTachograph";

const TrackingMap = dynamic(() => import("@/app/components/tracking/TrackingMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-50 flex items-center justify-center font-bold">Initializing History Map...</div>
});

export default function HistoryReplayPage() {
  const [vehicles, setVehicles] = useState<LiveVehicleState[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<LiveVehicleState | null>(null);
  const [historyData, setHistoryData] = useState<{ segments: HistorySegment[], events: TrackingEvent[], summary: TelemetrySummary } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"timeline" | "tachograph">("timeline");

  // Flatten points for playback
  const allPoints = useMemo(() => {
    if (!historyData) return [];
    return historyData.segments.flatMap(s => s.points);
  }, [historyData]);

  const currentPoint = allPoints[currentStep] || null;

  useEffect(() => {
    setVehicles(generateLiveVehicles(15));
  }, []);

  const handleVehicleSelect = (v: LiveVehicleState) => {
    setSelectedVehicle(v);
    setIsPlaying(false);
    setCurrentStep(0);
    setHistoryData(generateHistoryData(v.id));
    setViewMode("timeline"); // Reset to timeline on new selection
  };

  const handleTripSelect = (segment: HistorySegment) => {
    const firstPoint = segment.points[0];
    if (firstPoint) {
      const index = allPoints.findIndex(p => p.timestamp === firstPoint.timestamp);
      if (index !== -1) {
        setCurrentStep(index);
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < allPoints.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 500 / playSpeed);
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, allPoints.length, playSpeed]);

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* Top Controls Bar */}
      <div className="bg-white border-b border-gray-200 p-3 flex flex-wrap items-center justify-between gap-4 z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-100">
            <input type="date" className="bg-transparent border-none text-sm font-bold text-gray-700 px-3 outline-none" defaultValue="2026-03-09" />
            <div className="w-px h-4 bg-gray-200 self-center" />
            <span className="px-3 py-1 text-xs font-bold text-gray-400 self-center">TO</span>
            <input type="date" className="bg-transparent border-none text-sm font-bold text-gray-700 px-3 outline-none" defaultValue="2026-03-09" />
          </div>
          <button className="px-6 py-2 bg-[#004953] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#004953]/20 hover:scale-105 active:scale-95 transition-all">
            Filter
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 text-amber-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            Investigation Report
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar: Vehicle List or Trip Drill-down */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
          {selectedVehicle ? (
            /* Stage 2: Trip Drill-down */
            <div className="flex flex-col h-full animate-in slide-in-from-left duration-300">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <button 
                  onClick={() => setSelectedVehicle(null)}
                  className="flex items-center gap-2 text-[#004953] font-bold text-xs uppercase tracking-wider mb-3 hover:gap-3 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Back to Fleet
                </button>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-[#004953] rounded-xl flex items-center justify-center text-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 leading-tight">{selectedVehicle.name}</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase">{selectedVehicle.plateNumber}</p>
                    </div>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                  <button 
                    onClick={() => setViewMode("timeline")}
                    className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "timeline" ? 'bg-[#004953] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    Timeline
                  </button>
                  <button 
                    onClick={() => setViewMode("tachograph")}
                    className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === "tachograph" ? 'bg-[#004953] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    Tachograph
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                <div className="flex justify-between items-center px-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trip Timeline</p>
                  <span className="text-[9px] font-bold text-[#004953] bg-[#004953]/5 px-2 py-0.5 rounded-full">
                    {historyData?.segments.length || 0} SECTIONS
                  </span>
                </div>

                {historyData?.segments.map((seg, idx) => (
                  <div 
                    key={seg.id}
                    onClick={() => handleTripSelect(seg)}
                    className={`p-3 bg-white border rounded-2xl transition-all cursor-pointer group hover:shadow-md ${currentPoint && seg.points.some(p => p.timestamp === currentPoint.timestamp) ? 'border-[#004953] shadow-md ring-1 ring-[#004953]/10' : 'border-gray-100'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 size-2 rounded-full shrink-0 ${seg.type === 'driving' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">
                            {seg.type === 'driving' ? 'Driving Session' : 'Parked / Stop'}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400">
                            {new Date(seg.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                          <span>{seg.durationMinutes} min</span>
                          {seg.distanceKm > 0 && (
                            <>
                              <div className="size-0.5 bg-gray-300 rounded-full" />
                              <span>{seg.distanceKm} km</span>
                            </>
                          )}
                        </div>
                        {seg.avgSpeed && (
                          <div className="mt-2 flex items-center gap-1.5 overflow-hidden">
                            <div className="h-1 bg-gray-100 flex-1 rounded-full">
                              <div className="h-full bg-[#004953] rounded-full" style={{ width: `${(seg.avgSpeed / 120) * 100}%` }} />
                            </div>
                            <span className="text-[9px] font-black text-[#004953] shrink-0">{seg.avgSpeed} KM/H</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {viewMode === "tachograph" && (
                   <div className="mt-6 p-4 bg-[#004953]/5 border border-[#004953]/10 rounded-2xl animate-in fade-in duration-500">
                      <p className="text-[10px] font-black text-[#004953] uppercase tracking-widest mb-2">Analysis Tool</p>
                      <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                        Select a trip segment from the list above to isolate and investigate specific telemetry spikes on the main chart.
                      </p>
                   </div>
                )}
              </div>
            </div>
          ) : (
            /* Stage 1: Vehicle List */
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Select Vehicle</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search fleet..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#004953] transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 absolute left-3 top-2.5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {filteredVehicles.map(v => (
                  <div 
                    key={v.id}
                    onClick={() => handleVehicleSelect(v)}
                    className="p-3 bg-white border border-gray-50 rounded-xl hover:border-[#004953] hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900 leading-tight group-hover:text-[#004953] transition-colors">{v.name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{v.plateNumber}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-3 text-gray-300 group-hover:translate-x-1 group-hover:text-[#004953] transition-all">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
        
        <main className="flex-1 relative flex flex-col overflow-hidden bg-gray-50">
          {viewMode === "timeline" ? (
             <TrackingMap 
              historyPoints={allPoints}
              events={historyData?.events || []}
              center={currentPoint ? [currentPoint.lat, currentPoint.lng] : [24.7136, 46.6753]}
              zoom={selectedVehicle ? 15 : 12}
              showClustering={false}
              vehicles={currentPoint ? [{ 
                id: 'playback', name: 'Playback', plateNumber: 'LIVE', 
                lat: currentPoint.lat, lng: currentPoint.lng, 
                speed: currentPoint.speed, heading: currentPoint.heading,
                timestamp: currentPoint.timestamp,
                status: currentPoint.speed > 0 ? 'moving' : 'idle',
                ignition: true, odometer: 0, engineHours: 0, 
                gpsSignal: 'strong', lastUpdate: currentPoint.timestamp,
                alerts: 0, imei: 'MOCK'
              }] : []}
            />
          ) : (
            <div className="flex-1 p-8 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-black text-[#004953] uppercase tracking-[0.2em] mb-1">Advanced Telemetry</p>
                   <h2 className="text-3xl font-black text-gray-900">Trip Tachograph</h2>
                </div>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Current Speed</span>
                    <span className="text-xl font-black text-[#004953]">{currentPoint?.speed.toFixed(1) || '0.0'} <span className="text-xs font-medium">km/h</span></span>
                  </div>
                  <div className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Max Speed</span>
                    <span className="text-xl font-black text-red-600">{historyData?.summary.maxSpeed || '0'} <span className="text-xs font-medium">km/h</span></span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl shadow-[#004953]/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#004953]" />
                <TripTachograph 
                  points={allPoints} 
                  currentTime={currentPoint?.timestamp} 
                  onPointClick={(ts) => {
                    const index = allPoints.findIndex(p => p.timestamp === ts);
                    if (index !== -1) setCurrentStep(index);
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                 <div className="p-6 bg-white rounded-3xl border border-gray-50 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Speed Zones</p>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-gray-500">Normal (0-80)</span>
                          <span className="text-[#004953]">85%</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                          <div className="h-full bg-[#004953] w-[85%]" />
                       </div>
                       <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-gray-500">Caution (80-100)</span>
                          <span className="text-amber-500">12%</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-[12%]" />
                       </div>
                    </div>
                 </div>
                 
                 <div className="p-6 bg-white rounded-3xl border border-gray-50 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Driving Behavior</p>
                    <div className="flex items-center gap-4">
                       <div className="size-16 rounded-full border-4 border-[#004953]/20 flex items-center justify-center text-xl font-black text-[#004953]">
                          A+
                       </div>
                       <div className="text-xs font-bold text-gray-500 leading-relaxed">
                          Consistent speed maintained. No harsh braking events detected in this segment.
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-[#004953] rounded-3xl shadow-xl shadow-[#004953]/20 text-white relative overflow-hidden">
                    <svg className="absolute -right-4 -bottom-4 size-32 text-white/5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4">Current Location</p>
                    <p className="text-lg font-black leading-tight mb-1">{currentPoint?.lat.toFixed(4)}, {currentPoint?.lng.toFixed(4)}</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase">Riyadh Metropolitan Area</p>
                 </div>
              </div>
            </div>
          )}
          
          {/* Timeline Overlay */}
          {selectedVehicle && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-[1000]">
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="size-10 flex items-center justify-center bg-[#004953] text-white rounded-full shadow-lg shadow-[#004953]/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75ZM17.25 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      )}
                    </button>
                    <div className="flex flex-col">
                      <p className="text-xl font-black text-gray-900 tabular-nums">
                        {currentPoint ? new Date(currentPoint.timestamp).toLocaleTimeString([], { hour12: false }) : '--:--:--'}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Playback Time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1 font-black text-xs text-gray-500">
                    {[1, 5, 10].map(speed => (
                      <button 
                        key={speed}
                        onClick={() => setPlaySpeed(speed)}
                        className={`px-3 py-1.5 rounded-lg transition-all ${playSpeed === speed ? 'bg-white text-[#004953] shadow-sm' : 'hover:bg-white/50'}`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type="range" 
                    min="0" 
                    max={allPoints.length - 1} 
                    value={currentStep}
                    onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#004953]"
                  />
                  <div 
                    className="absolute -top-8 bg-[#004953] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    style={{ left: `${(currentStep / (allPoints.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                  >
                    {currentPoint ? new Date(currentPoint.timestamp).toLocaleTimeString() : ''}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>{allPoints.length > 0 ? new Date(allPoints[0].timestamp).toLocaleTimeString() : '--:--'}</span>
                  <span>{allPoints.length > 0 ? new Date(allPoints[allPoints.length - 1].timestamp).toLocaleTimeString() : '--:--'}</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar: Analytics & Investigation */}
        {selectedVehicle && historyData && (
          <aside className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto custom-scrollbar flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="p-6 bg-white border-b border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6">Historical Analytics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distance</p>
                  <p className="text-xl font-black text-[#004953]">{historyData.summary.totalDistance.toFixed(1)} <span className="text-sm font-medium">km</span></p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Top Speed</p>
                  <p className="text-xl font-black text-red-600">{historyData.summary.maxSpeed} <span className="text-sm font-medium">km/h</span></p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Moving Time</p>
                  <p className="text-xl font-black text-[#004953]">{Math.floor(historyData.summary.totalDrivingTime / 60)} <span className="text-sm font-medium">h</span> {historyData.summary.totalDrivingTime % 60} <span className="text-sm font-medium">m</span></p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fuel Used</p>
                  <p className="text-xl font-black text-amber-600">{historyData.summary.fuelConsumed} <span className="text-sm font-medium">L</span></p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Event Timeline</h4>
                <span className="text-[10px] font-bold text-[#004953] bg-[#004953]/10 px-2 py-0.5 rounded-full">{historyData.events.length} EVENTS</span>
              </div>
              <div className="space-y-3">
                {historyData.events.map(event => (
                  <div 
                    key={event.id}
                    className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#004953] transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl border ${
                        event.type === 'overspeed' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{event.type.replace('_', ' ')}</p>
                          <p className="text-[10px] font-bold text-gray-400">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
