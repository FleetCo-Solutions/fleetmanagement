"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function DynamicHeader() {
  const pathname = usePathname();
  
  // Logic to determine header based on path
  const isConfigurations = pathname.startsWith("/configurations");
  const isTracking = pathname.startsWith("/tracking");
  
  if (!isConfigurations && !isTracking) return null;

  const headerDetails = {
    title: isConfigurations 
      ? "Configurations" 
      : pathname.includes("/history") 
        ? "History Replay" 
        : "Tracking",
    tagline: isConfigurations 
      ? "System & Fleet Settings" 
      : pathname.includes("/live") 
        ? "Real-time Fleet Monitoring" 
        : pathname.includes("/history") 
          ? "Route History & Investigation" 
          : "Fleet Location & Movement",
    icon: isConfigurations ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5.5 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124-.072.044-.146.088-.22.128-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.088.22-.128.332-.183.582-.495.645-.869l.212-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor" className="size-5.5 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    )
  };

  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#004953] rounded-xl shadow-sm shadow-[#004953]/20">
          {headerDetails.icon}
        </div>
        <div className="flex flex-col">
          <p className="text-base font-bold text-gray-900 leading-tight">{headerDetails.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">{headerDetails.tagline}</p>
        </div>
      </div>
    </div>
  );
}
