"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { GPSPoint } from "@/app/types/tracking";

interface TripTachographProps {
  points: GPSPoint[];
  currentTime?: string;
  onPointClick?: (timestamp: string) => void;
}

export default function TripTachograph({ points, currentTime, onPointClick }: TripTachographProps) {
  const data = useMemo(() => points.map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    speed: p.speed,
    timestamp: p.timestamp,
  })), [points]);

  const handleChartClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const clickedPoint = state.activePayload[0].payload;
      if (onPointClick) {
        onPointClick(clickedPoint.timestamp);
      }
    }
  };

  const currentDataPoint = useMemo(() => 
    data.find(d => d.timestamp === currentTime),
    [data, currentTime]
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#004953] border border-white/20 p-2 rounded-lg shadow-xl outline-none z-[2000]">
          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{payload[0].payload.time}</p>
          <p className="text-sm font-black text-white">{payload[0].value} <span className="text-[10px] font-medium">km/h</span></p>
          <p className="text-[9px] text-white/40 mt-1">Click to jump to map</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-44 bg-white rounded-2xl border border-gray-100 p-2 shadow-sm cursor-pointer overflow-visible">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          onClick={handleChartClick}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#004953" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#004953" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="timestamp" 
            hide 
          />
          <YAxis 
            hide
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="speed" 
            stroke="#004953" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSpeed)" 
            isAnimationActive={false}
          />
          {currentDataPoint && (
             <ReferenceLine 
                x={currentDataPoint.timestamp} 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{ 
                  position: 'top', 
                  value: 'YOU', 
                  fill: '#ef4444', 
                  fontSize: 10, 
                  fontWeight: '900' 
                }}
             />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
