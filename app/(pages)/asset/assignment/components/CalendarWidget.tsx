"use client";
import React from "react";

interface CalendarWidgetProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

export default function CalendarWidget({ selectedDate, onDateSelect, className = "" }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(selectedDate);
  const [showYearSelector, setShowYearSelector] = React.useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate calendar days
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const calendarDays = generateCalendarDays(currentMonth);

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + (direction === 'next' ? 1 : -1)));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearSelector(false);
  };

  const currentYear = currentMonth.getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className={`bg-white p-3 ${className}`}>
      <div className="text-sm text-black mb-3 font-medium">Select Date</div>
      
      {/* Month and Year navigation */}
      <div className="flex items-center justify-between mb-3">
        <button 
          onClick={() => handleMonthChange('prev')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          ◀
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowYearSelector(!showYearSelector)}
            className="text-black font-medium hover:bg-gray-100 px-2 py-1 rounded"
          >
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </button>
        </div>
        
        <button 
          onClick={() => handleMonthChange('next')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          ▶
        </button>
      </div>

      {/* Year selector dropdown */}
      {showYearSelector && (
        <div className="absolute z-10 bg-white border rounded-lg shadow-lg p-2 max-h-32 overflow-y-auto">
          <div className="grid grid-cols-3 gap-1">
            {years.map(year => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className={`p-2 text-xs rounded hover:bg-gray-100 ${
                  year === currentYear ? 'bg-[#004953] text-white' : 'text-black'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-gray-500 font-medium">{day}</div>
        ))}
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(day)}
            className={`p-2 text-center rounded hover:bg-gray-100 ${
              isSameDay(day, selectedDate) 
                ? 'bg-[#004953] text-white' 
                : isToday(day)
                ? 'bg-blue-100 text-blue-900'
                : isCurrentMonth(day)
                ? 'text-black'
                : 'text-gray-400'
            }`}
          >
            {day.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}

