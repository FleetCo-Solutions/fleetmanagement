"use client";
import React from "react";

interface Assignment {
  id: string;
  driverName: string;
  startTime: string;
  endTime: string;
  vehicleId: string;
  status: 'active' | 'completed' | 'scheduled';
}

interface TimelineGridProps {
  assignments: Assignment[];
  selectedDate: Date;
  className?: string;
}

export default function TimelineGrid({ assignments, selectedDate, className = "" }: TimelineGridProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Convert time to hour position (0-23)
  const getHourPosition = (timeString: string) => {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour = hours;
    if (period === 'PM' && hours !== 12) hour += 12;
    if (period === 'AM' && hours === 12) hour = 0;
    return hour;
  };

  // Calculate assignment position and width
  const getAssignmentStyle = (assignment: Assignment) => {
    const startHour = getHourPosition(assignment.startTime);
    const endHour = assignment.endTime === 'No end date' 
      ? 23 
      : getHourPosition(assignment.endTime);
    
    const left = (startHour / 24) * 100;
    const width = ((endHour - startHour) / 24) * 100;
    
    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 border-green-300 text-green-900';
      case 'completed':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'scheduled':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  return (
    <div className={`relative overflow-x-auto ${className}`}>
      <div className="min-w-[1200px]">
        {/* Header row */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
            {hours.map((h) => (
              <div key={h} className={`relative py-2 border-l first:border-l-0 ${h % 6 === 0 ? "bg-gray-50" : ""}`}>
                <span className="text-xs text-black px-2">
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Body grid */}
        <div className="relative min-h-[400px]">
          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
            {hours.map((h) => (
              <div key={h} className={`border-l first:border-l-0 ${h % 6 === 0 ? "bg-gray-50" : ""}`} />
            ))}
          </div>

          {/* Assignment bars */}
          <div className="relative mt-4 space-y-3 px-3">
            {assignments.map((assignment, index) => (
              <div
                key={assignment.id}
                className={`absolute h-12 border rounded-md flex items-center px-4 text-sm font-medium ${getStatusColor(assignment.status)}`}
                style={{
                  ...getAssignmentStyle(assignment),
                  top: `${index * 60}px`,
                }}
              >
                <div className="truncate">
                  <span className="font-semibold">{assignment.driverName}</span>
                  <span className="ml-2 text-xs opacity-75">
                    {assignment.startTime} - {assignment.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
