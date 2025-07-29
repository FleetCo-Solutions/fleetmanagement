'use client'
import VehicleCard from "@/app/components/vehicleOverview/vehicleCard";
import VehicleTracker from "@/app/components/vehicleTracker";
import SideOverview from "./components/sideOverview";
import { useState } from "react";

const VehiclesOverview = () => {
  const [openOverview, setOpenOverview] = useState(false)
  return (
    <div className="flex h-full w-full">
    <SideOverview openOverview={openOverview} setOpenOverview={setOpenOverview} />
    <div className=" h-full bg-slate-100 flex-1 relative">
      <VehicleTracker/>
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
        <VehicleCard vehiclesNo={1} description="Vehicles with Errors" />
        <VehicleCard vehiclesNo={2} description="Vehicles with Warnings" />
        <VehicleCard vehiclesNo={10} description="Deviation from a Route" />
        <VehicleCard
          vehiclesNo={30}
          description="Vehicles Late to Destination"
        />
        <div className="bg-white flex items-center px-3 rounded-lg mr-4">
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
              d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
            />
          </svg>
        </div>
      </div>
    </div>
    </div>
  );
};

export default VehiclesOverview;
